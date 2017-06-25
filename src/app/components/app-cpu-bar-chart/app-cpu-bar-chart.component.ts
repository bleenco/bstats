import { Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-cpu-bar-chart',
  templateUrl: 'app-cpu-bar-chart.component.html'
})
export class AppCpuBarChartComponent implements OnInit, OnChanges {
  @Input() value: { idle: number, load: number, cores: any[] };

  barChartEl: any;
  svg: any;
  g: any;
  colors: string[];

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.barChartEl = this.elementRef.nativeElement.querySelector('.bar-chart');
    this.colors = ['#2AFFED', '#484859', '#E68945'];
  }

  ngOnChanges() {
    if (!this.value) {
      return;
    }

    if (!this.svg) {
      this.render();
    } else {
      this.updateValues();
    }
  }

  render() {
    let w = this.barChartEl.clientWidth;
    let barHeight = 25 + 15;
    let h = barHeight * (this.value.cores.length + 1) + 15;

    this.svg = d3.select(this.barChartEl).append('svg').attr('width', w - 15).attr('height', h);
    this.g = this.svg.append('g').attr('transform', 'translate(15, 15)');

    let x = d3.scaleLinear().range([0, w]);
    x.domain([0, 100]);

    let bar = this.g.selectAll('g')
      .data(this.value.cores)
      .enter().append('g')
      .attr('transform', (d: any, i: number) => `translate(0, ${i * barHeight})`);

    bar.append('rect')
      .attr('width', w)
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[1]);

    bar.append('rect')
      .attr('width', (d: any) => x(d.total))
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[0]);

    bar.append('text')
      .attr('x', (d: any) => x(100) / 2 - 20)
      .attr('y', barHeight / 2)
      .attr('dy', '-4')
      .attr('stroke', '#E68945')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('font-size', '10')
      .style('font-family', 'Verdana')
      .text((d: any) => `${d.total}%`);

    let totalBar = this.g.append('g')
      .attr('transform', (d: any, i: number) => `translate(0, ${this.value.cores.length * barHeight})`);

    totalBar.append('rect')
      .attr('width', w)
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[1]);

    totalBar.append('rect')
      .attr('width', x(this.value.load))
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[2]);

    totalBar.append('text')
      .attr('x', x(100) / 2 - 20)
      .attr('y', barHeight / 2)
      .attr('dy', '-4')
      .attr('stroke', '#E68945')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('font-size', '10')
      .style('font-family', 'Verdana')
      .text(`${this.value.load}%`);
  }

  updateValues(): void {
    let w = this.barChartEl.clientWidth;
    let barHeight = 25 + 15;

    let x = d3.scaleLinear().range([0, w]);
    x.domain([0, 100]);

    this.g.selectAll('g').remove();

    let bar = this.g.selectAll('g')
      .data(this.value.cores)
      .enter().append('g')
      .attr('transform', (d: any, i: number) => `translate(0, ${i * barHeight})`);

    bar.append('rect')
      .attr('width', w)
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[1]);

    bar.append('rect')
      .attr('width', (d: any) => x(d.total))
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[0]);

    bar.append('text')
      .attr('x', (d: any) => x(100) / 2 - 20)
      .attr('y', barHeight / 2)
      .attr('dy', '-4')
      .attr('stroke', '#E68945')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('font-size', '10')
      .style('font-family', 'Verdana')
      .text((d: any) => `${d.total}%`);

    let totalBar = this.g.append('g')
      .attr('transform', (d: any, i: number) => `translate(0, ${this.value.cores.length * barHeight})`);

    totalBar.append('rect')
      .attr('width', w)
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[1]);

    totalBar.append('rect')
      .attr('width', x(this.value.load))
      .attr('height', barHeight - 15)
      .attr('fill', this.colors[2]);

    totalBar.append('text')
      .attr('x', x(100) / 2 - 20)
      .attr('y', barHeight / 2)
      .attr('dy', '-4')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .style('font-size', '10')
      .style('font-family', 'Verdana')
      .text(`${this.value.load}%`);
  }
}
