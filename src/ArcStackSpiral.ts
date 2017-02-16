import * as d3 from 'd3';

import { group_by }         from './basechart';
import { SpiralBase }       from './SpiralBase';

interface IStackedHistogramOutput {
    x: number;
    dx: number;
    y: number;
    ys: {[key: string]: { y0: number, y1: number }};
}

// function object_map(f: (d: any) => any, obj: {[key: string]: any}): any {
//     return Object.keys(obj).reduce(
//         (r: any, k: string): any => {
//             r[k] = f(obj[k]);
//             return r;
//         },
//         {});
// }

// function zeros(n: number): number[] {
//     return Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0);
// }

/**
 * Charts data table as a filled curve on a spiral. We first create a histogram
 * of the data items, then plot the histogram as the thickness of a line (or
 * (filled curve). The number of points in the histogram is currently set by the
 * private member `n_points`.
 */
export class ArcStackSpiral<T> extends SpiralBase<T> {
    private stacked_hist_data: IStackedHistogramOutput[];
    private hist_fn: d3.layout.Histogram<T>;
    private n_points = 1000;
    private hist_x = d3.scale.linear().range([0, 1]);
    private hist_y = d3.scale.linear().range([0, 1]);

    constructor (element: d3.Selection<any>) {
        super(element);
        // this.radial_map = d => 1;
    }

    public set data(data: T[]) {
        // need to group by the return values by this.color_map
        const g_data = group_by<T>(this.category_map, data);
        const keys = Object.keys(g_data);

        this.hist_fn = d3.layout.histogram<T>()
            .value(this.radial_map)
            .bins(this.n_points);

        const hist_data: any[] = this.hist_fn(data);
        this.hist_x.domain(d3.extent(hist_data, a => a.x));
        this.hist_y.domain(d3.extent(hist_data, a => a.y));

        this.stacked_hist_data = hist_data.map((h) => {
            const g_h = group_by<T>(this.category_map, h);
            let cumsum = 0;
            const stack = keys.reduce(
                (s: any, k: string) => {
                    const n = (k in g_h ? g_h[k].length : 0);
                    if (n === 0) {
                        return s;
                    }

                    s[k] = { y0: cumsum, y1: cumsum + n };
                    cumsum += n;
                    return s;
                },
                {});
            return { x: h.x, dx: h.dx, y: h.y, ys: stack };
        });
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
            const d = this.stacked_hist_data[i];
            if (d.y === 0) {
                continue;
            }

            for (const k of Object.keys(d.ys)) {
                const arc = this.arc(
                    this.hist_x(d.x), this.hist_x(d.x + d.dx),
                    d.ys[k].y0 / d.y, d.ys[k].y1 / d.y);

                plot.append('path')
                    .attr('class', 'arc')
                    .attr('d', arc)
                    .style('fill', this.category_color(k))
                    .style('fill-opacity', this.hist_y(d.y) * 0.8 + 0.2);
            }
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
