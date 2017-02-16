import * as d3 from 'd3';

import { IHistogramOutput } from './basechart';
import { SpiralBase }       from './SpiralBase';

// (used to be in spiral.ts, module Chart)

/**
 * Charts data table as a filled curve on a spiral. We first create a histogram
 * of the data items, then plot the histogram as the thickness of a line (or
 * (filled curve). The number of points in the histogram is currently set by the
 * private member `n_points`.
 */
export class ArcSpiral<T> extends SpiralBase<T> {
    private hist_data: IHistogramOutput[];
    private hist_fn: d3.layout.Histogram<T>;
    private n_points = 1000;
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

    /**
     * Return an arc segment given a range on the spiral scale and an inner
     * and outer radius.
     *
     * @param x0 start of arc segment, in range [0, 1].
     * @param x1 end of arc segment, in range [0, 1].
     * @param r_inner inner radius, 0 is on axis, 1 on next winding, -1 on
     *     previous winding.
     * @param r_outer outer radius, same as `r_inner`.
     * @return SGV path
     */
    public arc(x0: number, x1: number, r_inner: number, r_outer: number) {
        const dr = this.period_fraction * this.radial_scale;
        const p0 = this.get_polar(x0);
        const p1 = this.get_polar(x1);
        const r_mid = (p0.r + p1.r) / 2;
        return d3.svg.arc()
            .innerRadius(r_mid + dr * r_inner * 0.8)
            .outerRadius(r_mid + dr * r_outer * 0.8)
            .startAngle(p0.phi + 1 * Math.PI / 2)
            .endAngle(p1.phi > p0.phi
                ? p1.phi + 1 * Math.PI / 2
                : p1.phi + 5 * Math.PI / 2);
    }

    public render(): d3.Selection<any> {
        // create SVG
        const svg = this.element.append('svg')
                    .attr('height', this.chartHeight)
                    .attr('width', this.chartWidth);

        // transform to center
        const plot = svg.append('g')
            .attr('transform', 'translate(400 300)');

        this.render_spiral_axis(plot);

        for (let i = 0; i < this.n_points; i += 1) {
            const d = this.hist_data[i];
            const arc = this.arc(
                this.hist_x(d.x), this.hist_x(d.x + d.dx), 0, 1.0);
            plot.append('path')
                .attr('class', 'arc')
                .attr('d', arc)
                .style('fill', 'red')
                .style('fill-opacity', this.hist_y(d.y) * 0.8 + 0.2);
        }

        return plot;
    }

    public refresh(): d3.Selection<any> {
        this.element.select('svg').remove();
        return this.render();
    }

    public update(data: T[]): d3.Selection<any> {
        this.element.select('svg').remove();
        this.data = data;
        return this.render();
    }
}
