import * as d3 from 'd3';

import { Base }        from './basechart';
import { Polar }       from './basechart';
import { ICoordinate } from './basechart';

// (used to be in spiral.ts, module Chart)

/**
 * This is the base class to other charts on a spiral.
 *
 * @member radial_map A function mapping a record of type T to a number,
 *     indicating time. A candidate for this function is
 *     `d3.time.Scale<number,number>`.
 * @member radial_scale An extra scaling factor to the output of `radial_map`.
 * @member period_fraction One over the number of windings on the spiral.
 * @member radius_map A function giving the radius of a bubble or weight of a
 *     data point.
 * @member color_map Returns a color-string given a record.
 * @member angular_map Maps a number (as output by radial_scale) to an angle.
 */
export class SpiralBase<T> extends Base<T> {

    public radial_map: (x: T) => number;

    public radial_scale: number;

    // the fraction of one turn against the entire range
    public period_fraction: number;

    public radius_map: (x: T) => number;

    public color_map: (x: T) => string = null;

    private angular_map(x: number) {
        return SpiralBase.MODULO(x, this.period_fraction) /
            this.period_fraction * 2 * Math.PI - Math.PI / 2;
    }

    public line_tics;

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

    public get_label(d: T): string {
        return '';
    }

    public get_polar(d: number): Polar {
        return new Polar((d * 0.8 + 0.15) * this.radial_scale,
                         this.angular_map(d));
    }

    public render_spiral_axis(
            plot: d3.Selection<any>) {
        let pts: ICoordinate[] = d3.range(1000).map(
            (i) => new Polar(
                ((i / 1000) * 0.8 + 0.15) * this.radial_scale,
                SpiralBase.MODULO(i / 1000, this.period_fraction) /
                    this.period_fraction * 2 * Math.PI)
        );

        const group = plot.append('g')
            .attr('class', 'axis');

        const line = d3.svg.line<ICoordinate>()
            .x((d, i) => d.x)
            .y((d, i) => d.y)
            .interpolate('basis');

        group.append('path')
            .datum(pts)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', '#000')
            .style('stroke-width', 0.5);

        return group;
    }

    public add_axis(
            selection: d3.Selection<any>,
            angle: number[], label: string[]) {
        const start = (a) => new Polar(0.2 * this.radial_scale, a);
        const end = (a) => new Polar(1.0 * this.radial_scale, a);

        const group = selection.append('g').attr('class', 'axes');

        const axes = group.selectAll('g.axis')
            .data(angle).enter().append('g').attr('class', 'axis');

        axes.append('line')
            .attr('x1', (d, i) => start(d).x).attr('y1', (d, i) => start(d).y)
            .attr('x2', (d, i) => end(d).x).attr('y2', (d, i) => end(d).y)
            .style('stroke', 'black')
            .style('stroke-width', 0.5);

        axes.append('text')
            .attr('x', (d, i) => end(d).inc_r(15).x)
            .attr('y', (d, i) => end(d).inc_r(15).y)
            .attr('text-anchor', 'middle').attr('dy', 5)
            .text((d, i) => label[i])
            .style('font-size', 16);

        return group;
    }
}
