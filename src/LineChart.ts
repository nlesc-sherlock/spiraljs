import * as d3 from 'd3';

import { Base }        from './basechart';
import { ICoordinate } from './basechart';
import { IMargin }     from './basechart';

export class LineChart extends Base<ICoordinate> {
    public margin: IMargin;

    constructor (element: d3.Selection<any>) {
        super(element);
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    }

    public get width(): number {
        return this.chartWidth - this.margin.left - this.margin.right;
    }
    public get height(): number {
        return this.chartHeight - this.margin.top - this.margin.bottom;
    }

    public render(data: ICoordinate[]): d3.Selection<any> {
        const x = d3.scale.linear().range([0, this.width]);
        const y = d3.scale.linear().range([this.height, 0]);
        const xAxis = d3.svg.axis().scale(x).orient('bottom');
        const yAxis = d3.svg.axis().scale(y).orient('left');
        const svg = this.element.append('svg')
            .attr('width', this.chartWidth)
            .attr('height', this.chartHeight)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        x.domain(d3.extent(data, a => a.x));
        y.domain(d3.extent(data, a => a.y));

        let line = d3.svg.line<ICoordinate>()
            .x(a => x(a.x))
            .y(a => y(a.y));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line);

        return svg;
    }
}
