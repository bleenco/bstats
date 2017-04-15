import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-cpu-pie',
  templateUrl: 'app-cpu-pie.component.html'
})
export class AppCpuPieComponent implements OnInit {
  pieChartEl: HTMLElement;
  svg: any;
  g: any;
  defs: any;
  data: any[];
  r: number

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.pieChartEl = this.elementRef.nativeElement.querySelector('.pie-chart');
    this.render();
  }

  render() {
    let w = this.pieChartEl.clientWidth;
    let h = this.pieChartEl.clientHeight;
    this.r = 160;

    this.svg = d3.select(this.pieChartEl).append('svg').attr('width', w).attr('height', h);

    this.g = this.svg.append('g')
      .attr('transform', 'translate(200, 200)');

    this.defs = this.svg.append('defs');

    this.data = [
      {label:"Basic", color:"#3366CC"},
      {label:"Plus", color:"#DC3912"},
      {label:"Lite", color:"#FF9900"},
      {label:"Elite", color:"#109618"},
      {label:"Delux", color:"#990099"}
    ].map(d => {
      return { label: d.label, value: 1000 * Math.random(), color: d.color };
    });

    let pie = d3.pie().sort(null).value((d: any) => d.value);
    let path = d3.arc()
      .outerRadius(this.r - 100)
      .innerRadius(0);

    // let arc = this.g.selectAll('.arc')
    //   .data(pie(this.data as any))
    //   .enter().append('g')
    //   .attr('class', 'arc');

    // arc.append('path')
    //   .attr('d', path)
    //   .attr('fill', (d: any) => d.data.color);

    let gPie = this.svg.append('g')
      .attr('transform', 'translate(200, 200)');

    this.createGradients();

    gPie.selectAll('.arc')
      .data(pie(this.data as any))
      .enter().append('path')
      .attr('fill', (d: any, i: number) => `url(#pie-gradient-${i}`)
      .attr('d', path)
      .attr('transform', 'scale(3, 3)');
  }

  createGradients() {
    let gradient = this.defs.selectAll('.gradient')
      .data(this.data.map(d => d.color))
      .enter().append('radialGradient')
      .attr('id', (d: any, i: number) => `pie-gradient-${i}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('cx', 0).attr('cy', 0).attr('r', this.r).attr('spreadMethod', 'pad');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', (d: any) => d);
    gradient.append('stop').attr('offset', '30%')
			.attr('stop-color', (d: any) => d)
			.attr('stop-opacity', 1);

		gradient.append('stop').attr('offset', '70%')
			.attr('stop-color', (d: any) => 'black')
			.attr('stop-opacity', 1);
  }
}
