///<reference path='../../typings/d3/d3.d.ts'/>

interface TimedRecord<T> {
    date:   Date;
    record: T;
    color?: string;
}

interface Coordinate {
    x: number;
    y: number;
}

class Cartesian implements Coordinate {
    constructor(public x: number, public y: number) {}
}

class Polar implements Coordinate {
    constructor (public r: number, public phi: number) {}
    get x() { return this.r * Math.cos(this.phi); }
    get y() { return this.r * Math.sin(this.phi); }

    public inc_r(dr: number): Polar {
        this.r += dr;
        return this;
    }
}

module Chart {
    export abstract class Base<T> {
        public chartWidth = 800;
        public chartHeight = 600;

        constructor (public element: d3.Selection<any>) {}

        public render(data: T[]): d3.Selection<any> {
            return null;
        }
    }

    export class BubbleSpiral<T> extends Base<T> {
        public radial_map: (x: T) => number;

        public radial_scale: number;

        // the fraction of one turn against the entire range
        public period_fraction: number;

        public radius_map: (x: T) => number;

        public color_map: (x: T) => string = null;

        private angular_map(x: T) {
            return modulo(this.radial_map(x), this.period_fraction) /
                this.period_fraction * 2 * Math.PI;
        }

        public line_tics;

        constructor (element: d3.Selection<any>) {
            super(element);
            this.radial_scale = this.chartHeight * 0.45;
        }

        public get_label(d: T): string {
            return '';
        }

        private get_polar(d: T): Polar {
            return new Polar(Math.sqrt(this.radial_map(d) * 0.8 + 0.15) * this.radial_scale,
                             this.angular_map(d));
        }

        private render_spiral_axis(
                plot: d3.Selection<any>) {
            var pts: Coordinate[] = d3.range(1000).map(
                (i) => new Polar(
                    this.radial_scale * Math.sqrt(i / 1000 * 0.8 + 0.15),
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

            // if (tics_data) {
            //     var tics = group.selectAll('g.tic')
            //         .data(tics_data)
            //         .enter().append('g')
            //         .attr('class', 'tic');

            //     tics.append('line')
            //         .attr('x1', (d, i) => this.get_polar(d).inc_r(-3).x)
            //         .attr('y1', (d, i) => this.get_polar(d).inc_r(-3).y)
            //         .attr('x2', (d, i) => this.get_polar(d).inc_r(+3).x)
            //         .attr('y2', (d, i) => this.get_polar(d).inc_r(+3).y)
            //         .style('stroke', '#888')
            //         .style('stroke-width', 0.5);

            //     tics.append('text')
            //         .attr('x', (d, i) => this.get_polar(d).inc_r(+3).x)
            //         .attr('y', (d, i) => this.get_polar(d).inc_r(+3).y)
            //         .attr('font-size', '10')
            //         .attr('font-family', 'Vollkorn')
            //         .text((d, i) => this.get_label(d));
            // }
            return group;
        }

        public add_axis(
                selection: d3.Selection<any>,
                angle: number[], label: string[]) {
            var start = (a) => new Polar(0.3 * this.radial_scale, a);
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

        public render(data: T[]): d3.Selection<any> {
            var svg = this.element.append('svg')
                        .attr('height', this.chartHeight)
                        .attr('width', this.chartWidth);

            var plot = svg.append('g')
                .attr('transform', 'translate(400 300)');

            this.render_spiral_axis(plot);

            var bubble_groups = plot.append('g').selectAll('g.bubble')
                .data(data)
                .enter().append('g')
                .attr('class', 'bubble');

            bubble_groups.append('circle')
                .attr('cx', (d, i) => this.get_polar(d).x)
                .attr('cy', (d, i) => this.get_polar(d).y)
                .attr('r', (d, i) => this.radius_map(d))
                .style('fill', this.color_map ? (d, i) => this.color_map(d) : (d, i) => 'red')
                .style('fill-opacity', 0.1)
                .style('stroke', 'black')
                .style('stroke-width', 0.1);

            return plot;
        }
    }
}

function modulo(x: number, y: number): number {
    if (x >= 0) {
        return x % y;
    } else {
        return y - (x % y);
    }
}

class TimedBubbleSpiral<T> extends Chart.BubbleSpiral<TimedRecord<T>> {
    private _period: d3.time.Interval;
    public time_scale: d3.time.Scale<number, number>;
    public color_map = function (d: TimedRecord<T>) {
        if (d.color) {
            return d.color;
        } else {
            return 'red';
        }
    };

    constructor (element: d3.Selection<any>) {
        super(element);
    }

    public radial_map = function (x: TimedRecord<T>) {
        return this.time_scale(x.date);
    };

    set period(p: d3.time.Interval) {
        this._period = p;

        var zero = this.time_scale.invert(0);
        this.period_fraction = this.time_scale(p.offset(zero, 1));
    }

    get period(): d3.time.Interval {
        return this._period;
    }

    public get_label(d: TimedRecord<T>): string {
        return d.date.toDateString();
    }

    public render(d: TimedRecord<T>[]): d3.Selection<any> {
        var plot = super.render(d);
        this.add_axis(plot,
            d3.range(24).map((i) => i / 24 * 2 * Math.PI),
            d3.range(24).map((i) => i.toString()));
        return plot;
    }
}

class TimedDataRow implements TimedRecord<IDataRow> {
    private _row: IDataRow;

    static colors: string[] = ['red', 'green', 'blue', 'purple', 'gold', 'cyan',
        'salmon', 'orange', 'DarkKhaki', 'violet', 'indigo', 'lime', 'olive', 'teal',
        'peru', 'maroon', 'sienna'];
    static color_map: { [name: string]: string } = {};

    constructor (r: IDataRow) {
        this._row = r;

        if (!(r.primary in TimedDataRow.color_map)) {
            var i = Object.keys(TimedDataRow.color_map).length;
            var j = TimedDataRow.colors.length;
            TimedDataRow.color_map[r.primary] = TimedDataRow.colors[i % j];
    //        console.log(r.primary + ' -> ' + TimedDataRow.colors[i % j]);
        }
    }

    get date(): Date { return this._row.moment.toDate(); }
    get record(): IDataRow { return this._row; }
    get color(): string { return TimedDataRow.color_map[this._row.primary]; }
}

class Spiral {
    private _data: TimedDataRow[];
    private chart: TimedBubbleSpiral<IDataRow>;

    constructor (id_tag: string) {
        this.chart = new TimedBubbleSpiral<IDataRow>(d3.select('#' + id_tag));
        // constructor function
    }

    public set data(d: IDataRow[]) {
        // function used to bind data to this object
        this._data = d.map((d) => new TimedDataRow(d));
        console.log(TimedDataRow.color_map);
        var min_date = Math.min.apply(null, this._data.map((d) => d.date));
        var max_date = Math.max.apply(null, this._data.map((d) => d.date));
        console.log(new Date(min_date));
        this.chart.time_scale = d3.time.scale().range([0, 1]).domain([min_date, max_date]);
        this.chart.radius_map = (d: TimedDataRow) => 8;
        //this.chart.period_fraction = 1 / 5;
        this.chart.period = d3.time.day;
    }

    public get data(): IDataRow[] {
        return this._data.map((d) => d.record);
    }

    public render() {
        this.chart.render(this._data);
    }
}

