import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stats',
  templateUrl: 'app-stats.component.html'
})
export class AppStatsComponent implements OnInit, OnDestroy {
  messages: Subscription;
  loadAvg1Min: { load: number, cores: number };
  loadAvg5Min: { load: number, cores: number };
  loadAvg15Min: { load: number, cores: number };
  netData: any[];
  cpuData: any[];
  loaded: boolean;

  constructor(private socket: SocketService) {
    this.loaded = false;
  }

  ngOnInit() {
    this.messages = this.socket.onMessage()
      .subscribe((output: { type: string, data: any }) => {
        setTimeout(() => this.loaded = true, 1000);

        if (output.type === 'cpu') {
          this.cpuData = output.data;
        } else if (output.type === 'network') {
          if (!this.netData) {
            this.netData = output.data;
          } else {
            this.netData.forEach((net, i) => {
              this.netData[i].in = null;
              this.netData[i].out = null;
              this.netData[i].inSpeed = null;
              this.netData[i].outSpeed = null;

              setTimeout(() => {
                this.netData[i].in = output.data[i].in;
                this.netData[i].out = output.data[i].out;
                this.netData[i].inSpeed = output.data[i].inSpeed;
                this.netData[i].outSpeed = output.data[i].outSpeed;
              });
            });
          }
      }
    });
  }

  ngOnDestroy() {
    this.messages.unsubscribe();
  }
}
