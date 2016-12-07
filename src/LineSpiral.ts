import * as d3 from 'd3';

import { IHistogramOutput } from './basechart';
import { Polar }            from './basechart';
import { SpiralBase }       from './SpiralBase';

// (used to be in spiral.ts, module Chart)

/**
 * Charts data table as a filled curve on a spiral. We first create a histogram
 * of the data items, then plot the histogram as the thickness of a line (or
 * (filled curve). The number of points in the histogram is currently set by the
 * private member `n_points`.
 */
export class LineSpiral<T> extends SpiralBase<T> {
    private hist_data: IHistogramOutput[];
    private hist_fn: d3.layout.Histogram<T>;
    private n_points = 10000;
    private hist_x = d3.scale.linear().range([0, 1]);
    private hist_y = d3.scale.linear().range([0, 1]);

    constructor (element: d3.Selection<any>) {
        super(element);
        // this.radial_map = d => 1;
    }

    public set data(data: T[]) {
        this.hist_fn = d3.layout.histogram<T>()
            .value(this.radial_map)
            .bins(this.n_points + 1);

        this.hist_data = this.hist_fn(data);
        this.hist_x.domain(d3.extent(this.hist_data, a => a.x));
        this.hist_y.domain(d3.extent(this.hist_data, a => a.y));
    }

    public render(): d3.Selection<any> {
        const svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        const plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        // this.render_spiral_axis(plot);

        const polar_data = this.hist_data.slice(1).map<[Polar, number]>(
            a => [this.get_polar(a.x + a.dx / 2), a.y]);

        const line = d3.svg.line<Polar>()
            .x(a => a.x) // * this.radial_scale)
            .y(a => a.y); // * this.radial_scale);

        // console.log(polar_data);
        // chop the graph in many pieces
        const piece_size = this.n_points / 256;
        for (let i = 0; i < 256; i += 1) {
            const piece = polar_data.slice(
                piece_size * i, piece_size * (i + 1));
            const top_part = piece.map(
                a => a[0].inc_r(a[1] * (this.period_fraction * 3)));
            const bottom_part = piece.map(
                a => a[0].inc_r(- a[1] * (this.period_fraction * 3)))
                .reverse();

            plot.append('path')
                .datum(top_part.concat(bottom_part))
                .attr('class', 'blob')
                .attr('d', line)
                .style('fill', 'blue')
                .style('fill-opacity', 0.7);
        }

        return plot;
    }

    public update(data: T[]): d3.Selection<any> {
        this.element.select('svg').remove();
        this.data = data;
        return this.render();
    }
}
