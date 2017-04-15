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

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.messages = this.socket.onMessage()
      .subscribe((output: { type: string, data: any }) => {
      if (output.type === 'loadavg') {
        // this.loadAvg1Min = null;
        // this.loadAvg5Min = null;
        // this.loadAvg15Min = null;

        // setTimeout(() => {
        //   this.loadAvg1Min = { load: data.message.load[0], cores: data.message.cores };
        //   this.loadAvg5Min = { load: data.message.load[1], cores: data.message.cores };
        //   this.loadAvg15Min = { load: data.message.load[2], cores: data.message.cores };
        // });
      } else if (output.type === 'network') {
        if (!this.netData) {
          this.netData = output.data;
        } else {
          this.netData.forEach((net, i) => {
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
