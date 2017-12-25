import * as uws from 'uws';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import * as logger from './logger';
import * as http from 'http';
import * as https from 'https';
import { readFileSync } from 'fs';
import { network, INetworkIface } from './network';
import { cpu, ICpuData } from './cpu';
import { memory, IMemoryData } from './memory';
import * as express from 'express';
import { getConfig } from './utils';
import * as querystring from 'querystring';

export interface ISocketServerOptions {
  app: express.Application;
}

export interface IOutput {
  type: string;
  data: INetworkIface[] | ICpuData | IMemoryData;
}

export interface Client {
  sessionID: string;
  session: { cookie: any, ip: string, userId: number, email: string, isAdmin: boolean };
  socket: uws.Socket;
  send: Function;
  subscriptions: { stats: Subscription };
}

export class SocketServer {
  options: ISocketServerOptions;
  connections: Observable<any>;
  clients: Client[];
  source: Observable<any>;

  constructor(options: ISocketServerOptions) {
    this.options = options;
    this.clients = [];
    this.source = Observable.merge(...[network(), cpu(), memory()]).share();
  }

  start(): Promise<void> {
    return new Promise(resolve => {
      this.setupServer(this.options.app);
    });
  }

  private setupServer(application: any): void {
    let config: any = getConfig();
    let server = null;

    if (config.ssl) {
      server = https.createServer({
        cert: readFileSync(config.sslCert),
        key: readFileSync(config.sslKey)
      }, application);
    } else {
      server = http.createServer(application);
    }

    const wss: uws.Server = new uws.Server({
      server: server
    });

    wss.on('connection', socket => {
      const client: Client = {
        sessionID: socket.upgradeReq.sessionID,
        session: socket.upgradeReq.session,
        socket: socket,
        send: (message: any) => client.socket.send(JSON.stringify(message)),
        subscriptions: { stats: null }
      };
      this.addClient(client);
      client.subscriptions.stats = this.source.subscribe(data => client.send(data));
      socket.on('close', (code, message) => this.removeClient(socket));
    });

    server.listen(config.port, () => {
      logger.info(`server running on port ${config.port}`)
    });
  }

  private addClient(client: Client): void {
    this.clients.push(client);
  }

  private removeClient(socket: uws.Socket): void {
    const index = this.clients.findIndex(c => c.socket === socket);
    const client = this.clients[index];

    Object.keys(client.subscriptions).forEach(sub => {
      if (client.subscriptions[sub]) {
        client.subscriptions[sub].unsubscribe();
      }
    });

    this.clients.splice(index, 1);
  }
}
