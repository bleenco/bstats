import { Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-cpu-bar-chart',
  templateUrl: 'app-cpu-bar-chart.component.html'
})
export class AppCpuBarChartComponent implements OnInit, OnChanges {
  @Input() value: { idle: number, total: number, cores: any[] };

  barChartEl: any;
  svg: any;
  g: any;
  colors: string[];

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.barChartEl = this.elementRef.nativeElement.querySelector('.bar-chart');
    this.colors = ['#65DBFF', '#E9EAEC'];
  }

  ngOnChanges() {
    if (!this.value) {
      return;
    }

    if (!this.svg) {
      this.render();
    }
  }

  render() {
    let w = this.barChartEl.clientWidth;
    let barHeight = 25 + 15;
    let h = barHeight * this.value.cores.length + 15;

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
      .attr('stroke', '#666666')
      .attr('stroke-width', 0.3)
      .style('font-size', '10')
      .style('font-family', 'Verdana')
      .text((d: any) => `${d.total}%`);
  }
}