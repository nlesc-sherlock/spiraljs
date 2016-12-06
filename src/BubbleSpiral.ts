import  * as d3 from 'd3';
import { SpiralBase } from './SpiralBase';

export class BubbleSpiral<T> extends SpiralBase<T> {
    constructor (element: d3.Selection<any>) {
        super(element);
    }

    public render(data: T[]): d3.Selection<any> {
        var svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        var plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        this.render_spiral_axis(plot);

        var bubble_groups = plot.append('g').selectAll('g.bubble')
            .data(data)
            .enter().append('g')
            .attr('class', 'bubble');

        bubble_groups.append('circle')
            .attr('cx', (d, i) => this.get_polar(this.radial_map(d)).x)
            .attr('cy', (d, i) => this.get_polar(this.radial_map(d)).y)
            .attr('r', (d, i) => this.radius_map(d))
            .style('fill', this.color_map ? (d, i) => this.color_map(d) : (d, i) => 'red')
            .style('fill-opacity', 0.1)
            .style('stroke', 'black')
            .style('stroke-width', 0.05);

        return plot;
    }

    public update(data: T[]): d3.Selection<any> {
        this.element.select('svg').remove();
        return this.render(data);
    }
}