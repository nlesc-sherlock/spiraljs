import { SpiralBase } from './SpiralBase';
import  * as d3 from 'd3';

/**
 * Chart data using bubbles on  a spiral. Each entry in a table is visualised
 * as a bubble; size and color may be varied using the methods `radius_map`
 * and `color_map`.
 */
export class BubbleSpiral<T> extends SpiralBase<T> {
    constructor (element: d3.Selection<any>) {
        super(element);
    }

    public render(data: T[]): d3.Selection<any> {
        const svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        const plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        this.render_spiral_axis(plot);

        const bubble_groups = plot.append('g').selectAll('g.bubble')
            .data(data)
            .enter().append('g')
            .attr('class', 'bubble');

        bubble_groups.append('circle')
            .attr('cx', (d) => this.get_polar(this.radial_map(d)).x)
            .attr('cy', (d) => this.get_polar(this.radial_map(d)).y)
            .attr('r', (d) => this.radius_map(d))
            .style('fill', this.color_map ? (d) => this.color_map(d) : () => 'red')
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
