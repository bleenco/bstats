import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ConfigServiceProvider } from './services/config.service';
import { SocketServiceProvider } from './services/socket.service';
import { AppComponent } from './app.component';
import { AppStatsComponent } from './components/app-stats';
import { AppCpuLineChartComponent } from './components/app-cpu-line-chart';
import { AppNetworkLineChartComponent } from './components/app-network-line-chart';
import { AppCpuPieComponent } from './components/app-cpu-pie';
import { AppCpuBarChartComponent } from './components/app-cpu-bar-chart';

@NgModule({
  declarations: [
    AppComponent,
    AppStatsComponent,
    AppCpuLineChartComponent,
    AppNetworkLineChartComponent,
    AppCpuPieComponent,
    AppCpuBarChartComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    ConfigServiceProvider,
    SocketServiceProvider
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
