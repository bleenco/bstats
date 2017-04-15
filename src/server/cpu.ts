import { cpus } from 'os';
import { Observable } from 'rxjs';
import { IOutput } from './socket';

export interface ICpuData {
  idle: number;
  total: number;
  cores: Object[]
}

export function cpu(): Observable<IOutput> {
  return Observable.timer(0, 2000)
    .timeInterval()
    .mergeMap(() => cpuLoad())
    .map((res: ICpuData) => {
      return { type: 'cpu', data: res };
    });
}

function cpuLoad(): Promise<ICpuData> {
  return new Promise(resolve => {
    let start = cpuAverage();

    setTimeout(() => {
      let end = cpuAverage();
      let idleDiff = end.idle - start.idle;
      let totalDiff = end.total - start.total;

      let cores = end.cores.map((core, i) => {
        return {
          idle: start.cores[i].idle - core.idle,
          total: start.cores[i].total - core.total
        };
      });

      let percentage = 100 - parseInt(<any>(100 * idleDiff / totalDiff), 10);
      let data = { load: percentage, idle: 100 - percentage, cores: cores };

      resolve(data);
    }, 2000);
  });
}

function cpuAverage(): { idle: number, total: number, cores: { idle: number, total: number }[] } {
  let totalIdle = 0;
  let totalTick = 0;
  let cpuData = cpus();

  let data = cpuData.map(core => {
    let coreTotal = Object.keys(core.times).reduce((acc, curr) => acc + core.times[curr], 0);
    let coreIdle = core.times.idle;

    return { idle: coreIdle, total: coreTotal };
  }).reduce((acc, curr) => {
    acc.idle += curr.idle;
    acc.total += curr.total;
    acc.cores.push(curr);

    return acc;
  }, { idle: 0, total: 0, cores: [] });

  return {
    idle: data.idle / data.cores.length,
    total: data.total / data.cores.length,
    cores: data.cores
  };
}
