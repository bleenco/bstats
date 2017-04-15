import * as ws from 'ws';
import { Observable, Observer, Subject } from 'rxjs';
import { info } from './logger';
import * as http from 'http';
import * as https from 'https';
import { readFileSync } from 'fs';
import { network, INetworkIface } from './network';

export interface ISocketServerOptions {
  port: number;
  ssl: boolean;
  sslKey?: string;
  sslCert?: string;
}

export interface IOutput {
  type: 'network' | 'loadavg';
  data: INetworkIface[]
}

export class SocketServer {
  options: ISocketServerOptions;
  connections: Observable<any>;

  constructor(options: ISocketServerOptions) {
    this.options = options;
  }

  start(): void {
    this.connections = this.createRxServer(this.options)
      .map(this.createRxSocket);

    this.init();
  }

  init(): void {
    this.connections.subscribe(conn => {
      conn.next({ type: 'status', message: 'connected' });

      let sub = Observable.merge(...[network()])
        .subscribe((data: IOutput) => conn.next(data));

      conn.subscribe(data => {
        data = JSON.parse(data);

        if (data.type === 'close') {
          sub.unsubscribe();
          conn.unsubscribe();
        }
      });
    });
  }

  private createRxServer = (options: ws.IServerOptions) => {
    return new Observable((observer: Observer<any>) => {
      info(`socket server running on port ${options.port} with SSL ${this.options.ssl}`);
      let app: any;

      if (this.options.ssl) {
        app = https.createServer({
          key: readFileSync(this.options.sslKey),
          cert: readFileSync(this.options.sslCert)
        }).listen(options.port);
      } else {
        app = http.createServer().listen(options.port);
      }

      let wss: ws.Server = new ws.Server({ server: app });
      wss.on('connection', (client: any) => {
        observer.next(client);
        info(`socket client connected from ${client._socket.remoteAddress}:${client._socket.remotePort}`);
      });

      return () => {
        wss.close();
      };
    }).share();
  }

  private createRxSocket = (connection: any) => {
    let messages = Observable.fromEvent(connection, 'message' , msg => {
      return typeof msg.data === 'string' ? msg.data : JSON.parse(msg.data);
    }).merge(Observable.create(observer => {
      connection.on('close', () => {
        observer.next(JSON.stringify({ type: 'close' }));
        connection.close();
        info('socket client disconnected.');
      });
    }));

    let messageObserver: any = {
      next(message) {
        if (connection.readyState === 1) {
          connection.send(JSON.stringify(message));
        }
      }
    };

    return Subject.create(messageObserver, messages);
  }
}
