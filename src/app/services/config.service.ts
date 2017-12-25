import { Injectable, Provider } from '@angular/core';

@Injectable()
export class ConfigService {
  wsurl: string;

  constructor() {
    let wssProto = location.protocol === 'https:' ? 'wss' : 'ws';
    let proto = location.protocol;
    let port = location.port === '8000' ? 7200 : location.port;

    this.wsurl = `${wssProto}://${location.hostname}:${port}`;
  }
}

export let ConfigServiceProvider: Provider = {
  provide: ConfigService, useClass: ConfigService
};
