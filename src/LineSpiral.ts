import { extent }      from 'd3-array';
import { histogram }   from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { Selection }   from 'd3-selection';
import { line }        from 'd3-shape';

import { IHistogramOutput } from './basechart';
import { Polar }            from './basechart';
import { SpiralBase }       from './SpiralBase';

/**
 * Charts data table as a filled curve on a spiral. We first create a histogram
 * of the data items, then plot the histogram as the thickness of a line (or
 * (filled curve). The number of points in the histogram is currently set by the
 * private member `n_points`.
 */
export class LineSpiral<T> extends SpiralBase<T> {
    private hist_data: IHistogramOutput[];
    private hist_fn: any;
    private n_points = 5000;
    private hist_x = scaleLinear().range([0, 1]);
    private hist_y = scaleLinear().range([0, 1]);

    constructor (element: Selection<any, any, any, any>) {
        super(element);
        // this.radial_map = d => 1;
    }

    public set data(data: T[]) {
        this.hist_fn = histogram()
            .value(this.radial_map)
            .bins(this.n_points + 1);

        this.hist_data = this.hist_fn(data);
        this.hist_x.domain(extent(this.hist_data, a => a.x));
        this.hist_y.domain(extent(this.hist_data, a => a.y));
    }

    public render(): Selection<any, any, any, any> {
        const svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        const plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        this.render_spiral_axis(plot);

        const polar_data = this.hist_data.slice(1)
            .map<[Polar, number]>(
                a => [this.get_polar(a.x + a.dx / 2), a.y]);

        const theline = line<Polar>()
            .x((a: any) => { return a.x; }) // * this.radial_scale)
            .y((a: any) => { return a.y; }); // * this.radial_scale);

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
                .attr('d', theline)
                .style('fill', 'blue')
                .style('fill-opacity', 0.7);
        }

        return plot;
    }

    public update(data: T[]): Selection<any, any, any, any> {
        this.element.select('svg').remove();
        this.data = data;
        return this.render();
    }
}
