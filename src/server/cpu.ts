import { cpus } from 'os';
import { Observable } from 'rxjs';
import { IOutput } from './socket';

export interface ICpuData {
  idle: number;
  irq: number;
  nice: number;
  sys: number;
  user: number;
  usage?: number;
}

export function cpu(): Observable<IOutput> {
  return Observable.timer(0, 2000)
    .timeInterval()
    .mergeMap(() => cpuUsage())
    .map((res: ICpuData) => {
      return { type: 'cpu', data: res };
    });
}

function cpuUsage(): Promise<ICpuData> {
  return new Promise(resolve => {
    let cpuData = cpus();
    let data = cpuData.map(cpu => {
      let total = Object.keys(cpu.times).reduce((acc, curr) => acc + cpu.times[curr], 0);

      return Object.keys(cpu.times).reduce((acc, curr) => {
        return Object.assign(acc, { [curr]: parseFloat(<any>(cpu.times[curr] / total * 100)).toFixed(2) });
      }, {});
    }).map((cpu: ICpuData) => {
      return Object.assign(cpu, { usage: parseFloat(<any>(100 - cpu.idle)).toFixed(2) });
    });

    resolve(data);
  });
}
