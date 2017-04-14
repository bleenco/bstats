import { Injectable, Provider } from '@angular/core';

@Injectable()
export class ConfigService {
  wsurl: string;

  constructor() {
    let loc: Location = document.location;
    let port: string = loc.port;
    let protocol = (port === '') ? 'wss://' : 'ws://';

    this.wsurl = `${protocol}${loc.hostname}:7210`;
  }
}

export let ConfigServiceProvider: Provider = {
  provide: ConfigService, useClass: ConfigService
};
