import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApiServiceProvider } from './services/api.service';
import { AuthServiceProvider } from './services/auth.service';
import { ConfigServiceProvider } from './services/config.service';
import { SocketServiceProvider } from './services/socket.service';
import { AppComponent } from './app.component';
import { AppStatsComponent } from './components/app-stats';
import { AppCpuLineChartComponent } from './components/app-cpu-line-chart';
import { AppNetworkLineChartComponent } from './components/app-network-line-chart';

@NgModule({
  declarations: [
    AppComponent,
    AppStatsComponent,
    AppCpuLineChartComponent,
    AppNetworkLineChartComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    ApiServiceProvider,
    AuthServiceProvider,
    ConfigServiceProvider,
    SocketServiceProvider
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
