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

    /**
     * Rescale the output of `weight_map` to create a decent size for the
     * bubbles.
     */
    public bubble_scale_fn(x: number): number {
        return x;
    }

    /**
     * Scale the size of bubbles using this map. This defaults to using
     * `weight_map` and scaling that using `bubble_scale_fn`. It is not
     * recommended to change this function directly.
     */
    public bubble_scale_map(x: T): number {
        return this.bubble_scale_fn(this.weight_map(x));
    }

    /**
     * Render given data as bubbles.
     */
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
            .attr('r', (d) => this.bubble_scale_map(d))
            .style('fill', this.color_map ? (d) => this.color_map(d) : () => 'red')
            .style('fill-opacity', 0.1)
            .style('stroke', 'black')
            .style('stroke-width', 0.05);

        return plot;
    }

    /**
     * Update the view. Currently clears the SVG and rerenders everything.
     */
    public update(data: T[]): d3.Selection<any> {
        this.element.select('svg').remove();
        return this.render(data);
    }
}
