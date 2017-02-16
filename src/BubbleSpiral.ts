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
    public bubble_scale_map(t: T): number {
        return this.bubble_scale_fn(this.weight_map(t));
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

        if (this.x_map) {
            const extent = d3.extent(data, (datum: T, _) => this.x_map(datum));
            const turn_range_sec = this.period_fraction * (extent[1] - extent[0]);

            // do the section from east to the end of the spiral
            const s1_range = BubbleSpiral.MODULO(1 / this.period_fraction, 1) - 1 / 4;
            const s1_fractions = d3.range(s1_range * 8 + 1).map(i => i / 8);
            const s1_start_sec = extent[1] - s1_range * turn_range_sec;
            const s1_labels = s1_fractions.map(i => (s1_start_sec + i * turn_range_sec)).map(this.label_map);

            // do the section from one past the start of the last winding to east
            const s2_range_start = s1_range + 1 / 8;
            const s2_range = 1 - s2_range_start;
            const s2_fractions = d3.range(s2_range * 8).map(i => i / 8);
            const s2_start_sec = extent[1] - 7 / 8 * turn_range_sec;
            const s2_labels = s2_fractions.map(i => (s2_start_sec + i * turn_range_sec)).map(this.label_map);

            const marks = s1_fractions.concat(s2_fractions.map(x => x + s2_range_start));
            const labels = s1_labels.concat(s2_labels);

            this.add_axis(plot, marks, labels);
        }

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
