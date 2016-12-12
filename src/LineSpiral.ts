import * as d3 from 'd3';
import * as d3Array from 'd3-array';
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
    private input_data: T[];
    private hist_data: d3Array.Bin<T, number>[];
    private hist_fn: d3Array.HistogramGenerator<T, number>;
    private n_points = 1000;

    public radial_map: any;

    constructor (element: d3.Selection<any, any, any, any>) {
        super(element);
    }

    public set data(data: T[]) {
        this.hist_fn = d3Array.histogram<T, number>();
        this.hist_fn.thresholds(this.n_points);
        this.hist_fn.value(this.radial_map);

        this.hist_data = this.hist_fn(data);

        this.input_data = data;
        console.log('LineSpriral: data:: 38', data);
    }

    public render(): d3.Selection<any, any, any, any> {
        const svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        const plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        // this.render_spiral_axis(plot);

        const that = this;
        function bin2pos(bin: d3Array.Bin<T, number>): [Polar, number] {
            return [that.get_polar((bin.x0 + bin.x1) / 2), bin.length];
        }

        const polar_data: [Polar, number][] = this.hist_data.slice(1).map(bin2pos);

        const line = d3.line<Polar>()
            .x(a => a.x)
            .y(a => a.y);

        // autoscale the vertical axis
        const max_bin_length = d3.max(polar_data, pair => pair[1]);

        // chop the graph into many pieces
        const piece_size = this.n_points / 256;
        for (let i = 0; i < 256; i += 1) {
            const piece = polar_data.slice(
                piece_size * i, piece_size * (i + 1));
            const top_part = piece.map(
                a => a[0].inc_r(a[1] * (this.period_fraction * this.radial_scale / max_bin_length / 2)));
            const bottom_part = piece.map(
                a => a[0].inc_r(- a[1] * (this.period_fraction * this.radial_scale / max_bin_length / 2)))
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

    public update(data: T[]): d3.Selection<any, any, any, any> {
        this.element.select('svg').remove();
        this.data = data;
        return this.render();
    }
}
