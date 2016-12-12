import { extent }      from 'd3-array';
import { axisBottom }  from 'd3-axis';
import { axisLeft }    from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { line }        from 'd3-shape';

import { Base }        from './basechart';
import { ICoordinate } from './basechart';
import { IMargin }     from './basechart';

export class LineChart extends Base<ICoordinate> {
    public margin: IMargin;

    constructor (element: d3.Selection<any, any, any, any>) {
        super(element);
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    }

    public get width(): number {
        return this.chartWidth - this.margin.left - this.margin.right;
    }
    public get height(): number {
        return this.chartHeight - this.margin.top - this.margin.bottom;
    }

    public render(data: ICoordinate[]): d3.Selection<any, any, any, any> {
        const x = scaleLinear()
            .range([0, this.width])
            .domain(extent(data, a => a.x));

        const y = scaleLinear()
            .range([this.height, 0])
            .domain(extent(data, a => a.y));

        const svg = this.element.append('svg')
            .attr('width', this.chartWidth)
            .attr('height', this.chartHeight)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        const theline = line<ICoordinate>()
            .x(a => x(a.x))
            .y(a => y(a.y));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(axisBottom(x));

        svg.append('g')
            .attr('class', 'y axis')
            .call(axisLeft(y));

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', theline);

        return svg;
    }
}
