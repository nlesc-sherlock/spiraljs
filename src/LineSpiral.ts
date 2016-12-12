import * as d3 from 'd3';
import * as d3Array from 'd3-array';
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
    //private hist_fn: d3.histogram<T>;
    private n_points = 10000;
    private hist_x0 = d3.scaleLinear().range([0, 1]);
    private hist_x1 = d3.scaleLinear().range([0, 1]);
    private hist_y = d3.scaleLinear().range([0, 1]);
    //private hist_fn : any;

    public radial_map: any;

    constructor (element: d3.Selection<any, any, any, any>) {
        super(element);
    }

    public set data(data: T[]) {
        const test = d3Array.histogram().thresholds(this.n_points + 1).value(this.radial_map);
        console.log(d3.histogram);
        console.log(test);

        this.hist_data = test(data);
        this.hist_x0.domain(d3.extent(this.hist_data, a => a.x0));
        this.hist_x1.domain(d3.extent(this.hist_data, a => a.x1));
        this.hist_y.domain(d3.extent(this.hist_data, a => a.y));

        console.log('LineSpriral: data:: 38', data);
    }

    public render(): d3.Selection<any, any, any, any> {
        const svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        const plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        // this.render_spiral_axis(plot);

        const polar_data = this.hist_data.slice(1).map<[Polar, number]>(
            a => [this.get_polar(a.x0 + a.x1 / 2), a.y]);

        const line = d3.line<Polar>()
            .x(a => a.x)
            .y(a => a.y);

        console.log(line);
        console.log(polar_data);

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

    public update(data: T[]): d3.Selection<any, any, any, any> {
        this.element.select('svg').remove();
        this.data = data;
        return this.render();
    }
}
