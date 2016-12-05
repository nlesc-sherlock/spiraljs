
// (used to be in spiral.ts, module Chart)

class SpiralBase<T> extends Base<T> {
    public radial_map: (x: T) => number;

    public radial_scale: number;

    // the fraction of one turn against the entire range
    public period_fraction: number;

    public radius_map: (x: T) => number;

    public color_map: (x: T) => string = null;

    private angular_map(x: number) {
        return modulo(x, this.period_fraction) /
            this.period_fraction * 2 * Math.PI - Math.PI / 2;
    }

    public line_tics;

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
        var pts: Coordinate[] = d3.range(1000).map(
            (i) => new Polar(
                ((i / 1000) * 0.8 + 0.15) * this.radial_scale,
                modulo(i / 1000, this.period_fraction) /
                    this.period_fraction * 2 * Math.PI)
        );

        var group = plot.append('g')
            .attr('class', 'axis');

        var line = d3.svg.line<Coordinate>()
            .x((d, i) => d.x)
            .y((d, i) => d.y)
            .interpolate('basis');

        var axis = group.append('path')
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
        var start = (a) => new Polar(0.2 * this.radial_scale, a);
        var end = (a) => new Polar(1.0 * this.radial_scale, a);

        var group = selection.append('g').attr('class', 'axes');

        var axes = group.selectAll('g.axis')
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

