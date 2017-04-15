import { platform } from 'os';
import { spawn } from 'child_process';
import { Observable } from 'rxjs';
import { getHumanSize } from './utils';
import { IOutput } from './socket';

export interface INetworkIface {
  iface: string;
  address: string;
  in: number;
  inHuman: string;
  inSpeed: number;
  inSpeedHuman: string;
  out: number;
  outHuman: string;
  outSpeed: number;
  outSpeedHuman: string;
}

let inputUtilization: number[] = [];
let outputUtilization: number[] = [];

export function network(): Observable<IOutput> {
  return Observable.timer(0, 2000)
    .timeInterval()
    .mergeMap(() => netstat(['-in']))
    .map(res => {
      let output = parseNetstatOutput(res);

      let data = output.map((iface, i) => {
        let inSpeed = ((iface.in  || 0) - (inputUtilization[i]  || 0)) / 2;
        iface.inSpeed = inSpeed;
        iface.inSpeedHuman = `${getHumanSize(inSpeed)}/s`;

        let outSpeed = ((iface.out || 0) - (outputUtilization[i] || 0)) / 2;
        iface.outSpeed = outSpeed;
        iface.outSpeedHuman = `${getHumanSize(outSpeed)}/s`;

        inputUtilization[i] = iface.in;
        outputUtilization[i] = iface.out;

        return iface;
      });

      return { type: 'network', data: data };
    });
}

function netstat(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let nstat = spawn('netstat', args);
    let output: string = '';
    let error: string = '';

    nstat.stdout.on('data', (data: string) => {
      output += data;
    });

    nstat.stderr.on('data', (data: string) => {
      error += data;
    });

    nstat.on('close', (code: number) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(error);
      }
    });
  });
}

function parseNetstatOutput(data: string): INetworkIface[] {
  return data
    .split('\n')
    .filter((line, i) => !!line && i !== 0)
    .filter(line => {
      let splitted = line.split(/ +/);
      return platform() === 'darwin' ? splitted[3].includes('.') : parseInt(splitted[3], 10) > 0;
    })
    .map(line => {
      let splitted = line.split(/ +/);

      let iface = splitted[0].trim();
      let address = platform() === 'darwin' ? splitted[3].trim() : '';
      let mtu = parseInt(splitted[1], 10);
      let rx = platform() === 'darwin' ? parseInt(splitted[4], 10) : parseInt(splitted[3], 10);
      let tx = platform() === 'darwin' ? parseInt(splitted[6], 10) : parseInt(splitted[7], 10);

      return {
        iface: iface,
        address: address,
        in: rx * mtu,
        inHuman: getHumanSize(rx * mtu),
        inSpeed: null,
        inSpeedHuman: null,
        out: tx * mtu,
        outHuman: getHumanSize(tx * mtu),
        outSpeed: null,
        outSpeedHuman: null
      };
    });
}
