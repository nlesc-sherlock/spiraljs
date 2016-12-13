import * as d3 from 'd3';

import { Base }        from './basechart';
import { Polar }       from './basechart';
import { ICoordinate } from './basechart';

// (used to be in spiral.ts, module Chart)

/**
 * This is the base class to other charts on a spiral. It gives a low level
 * interface on top of which we can implement several type of spiral charts.
 *
 * Several members have the `_map` suffix. This means that these members are
 * functions that map a data element to some value used in plotting the spiral.
 */
export class SpiralBase<T> extends Base<T> {
    /**
     * Maps a data element to a number in the range [0, 1]. The returned number
     * then indicates the place on the spiral that the data element should be
     * given. Such a map can be created using `d3.scale`, setting the range
     * to [0, 1] and the domain to the domain of your data.
     */
    public radial_map: (x: T) => number;

    /**
     * A multiplier for the output of `radial_map`. This determines the scale
     * at which the spiral is being plotted. It defaults to
     * `this.chartHeight * 0.45`.
     */
    public radial_scale: number;

    /**
     * The fraction of one turn against the entire range. This is one over the
     * number of windings in the spiral. Suppose you have a spiral mapping a
     * time range of a few months and want to study periodicity over one day,
     * then `period_fraction` should be set to one day over the entire time
     * domain.
     */
    public period_fraction: number;

    /**
     * Get the weight of a data element. This weight will function as indication
     * of radius in the `BubbleSpiral`, but can also be leveraged as a weight
     * when generating a histogram for the `LineSpiral` and `ArcSpiral` charts.
     */
    public weight_map: (x: T) => number;

    /**
     * Get the color by which a data element is plotted. This is currently only
     * used in the `BubbleSpiral`.
     */
    public color_map: (x: T) => string = null;

    /**
     * (private) Computes the angle at which a point is plotted, given the
     * output of `radial_map`.
     */
    private angular_map(x: number) {
        return SpiralBase.MODULO(x, this.period_fraction) /
            this.period_fraction * 2 * Math.PI - Math.PI / 2;
    }

    public line_tics: any;

    /**
     * Computes `x` modulo `y` correctly, also for negative numbers.
     */
    static MODULO(x: number, y: number): number {
        if (x >= 0) {
            return x % y;
        } else {
            return y - (x % y);
        }
    }

    constructor (element: d3.Selection<any>) {
        super(element);
        this.radial_scale = this.chartHeight * 0.45;
    }

    /**
     * Get a label given a data element; used for labeling tics.
     */
    public label_map(_: T): string {
        return '';
    }

    /**
     * Return polar coordinates on the plot given a number in the range [0, 1].
     */
    public get_polar(d: number): Polar {
        return new Polar((d * 0.8 + 0.15) * this.radial_scale,
                         this.angular_map(d));
    }

    /**
     * Render the line on top of which the data points should be plotted.
     */
    public render_spiral_axis(
            plot: d3.Selection<any>) {
        const pts: ICoordinate[] = d3.range(-1, 1001).map(
                (i) => this.get_polar(i / 1000));

        const group = plot.append('g')
            .attr('class', 'axis');

        const line = d3.svg.line<ICoordinate>()
            .x((d) => d.x)
            .y((d) => d.y)
            .interpolate('basis-open');

        group.append('path')
            .datum(pts)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', '#000')
            .style('stroke-width', 0.5);

        return group;
    }

    /**
     * Draw an axis at a certain angle (radians), with a given label.
     */
    public add_axis(
            selection: d3.Selection<any>,
            angle: number[], label: string[]) {
        const start = (a: any) => new Polar(0.2 * this.radial_scale, a);
        const end = (a: any) => new Polar(1.0 * this.radial_scale, a);

        const group = selection.append('g').attr('class', 'axes');

        const axes = group.selectAll('g.axis')
            .data(angle).enter().append('g').attr('class', 'axis');

        axes.append('line')
            .attr('x1', (d) => start(d).x).attr('y1', (d) => start(d).y)
            .attr('x2', (d) => end(d).x).attr('y2', (d) => end(d).y)
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        axes.append('text')
            .attr('x', (d) => end(d).inc_r(15).x)
            .attr('y', (d) => end(d).inc_r(15).y)
            .attr('text-anchor', 'middle').attr('dy', 5)
            .text((_, i) => label[i])
            .style('font-size', 16);

        return group;
    }
}
