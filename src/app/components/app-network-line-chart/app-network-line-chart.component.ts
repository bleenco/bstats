import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-network-line-chart',
  templateUrl: 'app-network-line-chart.component.html'
})
export class AppNetworkLineChartComponent implements OnInit, OnChanges {
  @Input() iface: string;
  @Input() speedIn: number;
  @Input() speedOut: number;

  lineChartEl: HTMLElement;
  svg: any;
  g: any;
  line: any;
  pathIn: any;
  pathOut: any;
  x: any;
  y: any;
  xAxis: any;
  xAxisEl: any;
  yAxis: any;
  yAxisEl: any;
  dataIn: number[];
  dataOut: number[];
  now: Date;
  duration: number;
  limit: number;
  title: string;
  max: number;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.limit = 20;
    this.duration = 2000;
    this.now = new Date(Date.now() - this.duration);
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (!this.iface) {
        return;
      }

      if (!this.title) {
        this.title = this.iface;
      }

      this.updateData(this.speedIn, this.speedOut);
    });
  }

  render() {
    this.lineChartEl = this.elementRef.nativeElement.querySelector('.line-chart');

    let m = { top: 5, right: 5, bottom: 5, left: 5 };
    let w = this.lineChartEl.clientWidth - 30;
    let h = w - (w / 3);

    this.svg = d3.select(this.lineChartEl).append('svg')
      .attr('width', w - m.left - m.right)
      .attr('height', h - m.top - m.bottom);

    this.g = this.svg.append('g');
    this.g.attr('transform', `translate(0, -30)`);

    this.dataIn = d3.range(this.limit).map(i => 0);
    this.dataOut = d3.range(this.limit).map(i => 0);

    this.max = 0;

    this.x = d3.scaleTime().range([0, w - m.left - m.right]);
    this.y = d3.scaleLinear().range([h - m.top - m.bottom, 0]);

    this.x.domain([<any>this.now - (this.limit - 2), <any>this.now - this.duration]);
    this.y.domain([0, d3.max(this.dataIn.concat(this.dataOut), (d: any) => d)]);

    this.xAxis = d3.axisBottom(this.x);

    this.yAxis = d3.axisLeft(this.y)
      .tickSizeInner(-w - 100)
      .tickSizeOuter(0)
      .tickPadding(10);

    this.xAxisEl = this.svg.append('g')
      .attr('width', w - 40)
      .attr('transform', `translate(0, ${h - 30})`)
      .attr('class', 'xaxis')
      .call(this.xAxis);

    this.yAxisEl = this.svg.append('g')
      .attr('width', w - 40)
      .attr('class', 'yaxis')
      .call(this.yAxis);

    this.line = d3.line()
      .x((d: any, i: number) => this.x(<any>this.now - (this.limit - 1 - i) * this.duration))
      .y((d: any) => this.y(d))
      .curve(d3.curveBasis);

    this.pathIn = this.g.append('path')
      .attr('stroke', '#3A84C5')
      .attr('stroke-width', '3')
      .attr('fill', 'transparent');

    this.pathOut = this.g.append('path')
      .attr('stroke', '#6E7F9A')
      .attr('stroke-width', '3')
      .attr('fill', 'transparent');
  }

  updateData = (valueIn: number, valueOut: number) => {
    this.dataIn.push(valueIn);
    this.dataOut.push(valueOut);
    this.now = new Date();

    let currentMax = d3.max(this.dataIn.concat(this.dataOut), (d: any) => d);
    this.max = currentMax > this.max ? currentMax : this.max;

    this.x.domain([<any>this.now - (this.limit - 2) * this.duration, <any>this.now - this.duration]);
    this.y.domain([0, this.max]);

    d3.select(this.lineChartEl).select('.yaxis').remove();

    this.yAxis.ticks(5).tickFormat(this.getHumanSize);

    this.xAxisEl.transition()
      .duration(this.duration)
      .ease(d3.easeLinear)
      .call(this.xAxis);

    this.yAxisEl = this.svg.append('g')
      .attr('transform', 'translate(40, -35)')
      .attr('class', 'yaxis')
      .call(this.yAxis);

    this.pathIn
      .transition()
      .duration(0)
      .attr('d', this.line(this.dataIn))
      .attr('transform', null)
      .transition()
      .duration(this.duration)
      .ease(d3.easeLinear)
      .attr('transform', `translate(${this.x(<any>this.now - (this.limit - 1) * this.duration)}, 0)`);

    this.pathOut
      .transition()
      .duration(0)
      .attr('d', this.line(this.dataOut))
      .attr('transform', null)
      .transition()
      .duration(this.duration)
      .ease(d3.easeLinear)
      .attr('transform', `translate(${this.x(<any>this.now - (this.limit - 1) * this.duration)}, 0)`);

    this.dataIn.shift();
    this.dataOut.shift();
  }

  getHumanSize(bytes: number, decimals: number = 2): string {
    if (!bytes) {
      return '0 KB';
    }

    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const k = 1000;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }

}
