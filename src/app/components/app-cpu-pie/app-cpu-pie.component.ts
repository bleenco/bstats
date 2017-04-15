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
  pie: any;
  path: any;
  pathEl: any;
  arc: any;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.pieChartEl = this.elementRef.nativeElement.querySelector('.pie-chart-container');
    this.render();
  }

  render() {
    let w = this.pieChartEl.clientWidth;
    let h = this.pieChartEl.clientHeight;
    this.r = 160;

    this.svg = d3.select(this.pieChartEl).select('.pie-chart').append('svg').attr('width', w).attr('height', h);

    this.g = this.svg.append('g')
      .attr('transform', 'translate(200, 200)');

    this.defs = this.svg.append('defs');

    this.data = [
      {label:"Basic", color:"#438FCC"},
      {label:"Plus", color:"#88C340"},
      {label:"Lite", color:"#DA031B"},
      {label:'Aloha', color: '#6E7F9A'},
      {label:"Elite", color:"#FFC356"},
      {label:"Delux", color:"#65DBFF"},
      {label:'Haloha', color: '#65DBFF'},
    ].map(d => {
      return { label: d.label, value: 1000 * Math.random(), color: d.color };
    });

    this.pie = d3.pie().sort(null).value((d: any) => d.value);
    this.arc = d3.arc()
      .outerRadius(this.r)
      .innerRadius(0);

    let label = d3.arc()
      .outerRadius(this.r - 40)
      .innerRadius(this.r - 40);

    this.createGradients();

    this.path = this.svg.datum(this.data).selectAll('path')
      .data(this.pie)
      .enter().append('path')
      .attr('transform', 'translate(200, 200)')
      .attr('fill', (d: any, i: number) => `url(#pie-gradient-${i}`)
      .attr('d', this.arc)
      .each(function(d) { this._current = d; });

    setTimeout(() => {
      this.change();
    }, 2000);
  }

  change = () => {
    this.data = this.data.map(d => {
      return { label: d.label, value: 1000 * Math.random(), color: d.color };
    });

    this.pie.value((d: any, i: number) => this.data[i].value);
    this.path = this.path.data(this.pie);
    this.path.transition().duration(2000).attrTween('d', arcTween);

    let arc = this.arc;

    function arcTween(a) {
      let i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      }
    }
  }

  createGradients(): void {
    let gradient = this.defs.selectAll('.gradient')
      .data(this.data.map(d => d.color))
      .enter().append('radialGradient')
      .attr('id', (d: any, i: number) => `pie-gradient-${i}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('cx', 0).attr('cy', 0).attr('r', this.r + 200).attr('spreadMethod', 'pad');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', (d: any) => d);
    gradient.append('stop').attr('offset', '30%')
			.attr('stop-color', (d: any) => d)
			.attr('stop-opacity', 1);

		gradient.append('stop').attr('offset', '70%')
			.attr('stop-color', (d: any) => 'black')
			.attr('stop-opacity', 1);
  }
}
