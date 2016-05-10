/// <reference path="chartbase.ts" />
/// <reference path="linechart.ts" />
/// <reference path="dsp.ts" />

import complex = Complex.Complex;

interface TimedRecord<T> {
    date:   Date;
    record: T;
    color?: string;
}


module TimeScale {
     interface Map<T> {
         [key: string]: T;
     }

     let seconds_in: Map<number> = {
         'second': 1,
         'minute': 60,
         'hour': 3600,
         'day': 24 * 3600,
         'week': 168 * 3600,
         'fortnight': 336 * 3600,
         'month': 365.249 / 12 * 3600,  // on average
         'year': 365.249 * 3600
     };
}


module Chart {
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

    export class LineSpiral<T> extends SpiralBase<T> {
        private hist_data: HistogramOutput[];
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
            var svg = this.element.append('svg')
                        .attr('height', this.chartHeight)
                        .attr('width', this.chartWidth);

            var plot = svg.append('g')
                .attr('transform', 'translate(400 300)');

            // this.render_spiral_axis(plot);

            let polar_data = this.hist_data.slice(1).map<[Polar, number]>(
                a => [this.get_polar(a.x + a.dx / 2), a.y]);

            var line = d3.svg.line<Polar>()
                .x(a => a.x) // * this.radial_scale)
                .y(a => a.y); // * this.radial_scale);

            // console.log(polar_data);
            // chop the graph in many pieces
            let piece_size = this.n_points / 256;
            for (var i = 0; i < 256; ++i) {
                let piece = polar_data.slice(piece_size * i, piece_size * (i + 1));
                let top_part = piece.map(
                    a => a[0].inc_r(a[1] * (this.period_fraction * 3)));
                let bottom_part = piece.map(
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

    export class BubbleSpiral<T> extends SpiralBase<T> {
        constructor (element: d3.Selection<any>) {
            super(element);
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
                .attr('cx', (d, i) => this.get_polar(this.radial_map(d)).x)
                .attr('cy', (d, i) => this.get_polar(this.radial_map(d)).y)
                .attr('r', (d, i) => this.radius_map(d))
                .style('fill', this.color_map ? (d, i) => this.color_map(d) : (d, i) => 'red')
                .style('fill-opacity', 0.1)
                .style('stroke', 'black')
                .style('stroke-width', 0.05);

            return plot;
        }

        public update(data: T[]): d3.Selection<any> {
            this.element.select('svg').remove();
            return this.render(data);
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

class TimedBubbleSpiral<T> extends Chart.LineSpiral<TimedRecord<T>> {
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

    set period_seconds(p: number) {
        let zero = this.time_scale.invert(0);
        let iv = d3.time.second.offset(zero, p);
        this.period_fraction = this.time_scale(iv);
    }

    public get_label(d: TimedRecord<T>): string {
        return d.date.toDateString();
    }

    public render(): d3.Selection<any> {
        var plot = super.render();
        this.add_axis(plot,
            d3.range(16).map((i) => i / 8 * Math.PI - Math.PI / 2),
            d3.range(16).map((i) => (i / 8).toString() + 'π'));
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

    get date(): Date { return new Date(this._row.datestr); }
    get record(): IDataRow { return this._row; }
    get color(): string { return TimedDataRow.color_map[this._row.primary]; }
}

class Spiral {
    public _data: TimedDataRow[];
    public chart: TimedBubbleSpiral<IDataRow>;
    private hist_chart: Chart.LineChart;
    private power_chart: Chart.LineChart;

    private histogram: any;
    private _hist_fn: d3.layout.Histogram<TimedDataRow>;
    private _hist_data: Coordinate[];
    private _power_data: Coordinate[];

    constructor (id_tag: string) {
        this.chart = new TimedBubbleSpiral<IDataRow>(d3.select('#' + id_tag));
        this.hist_chart = new Chart.LineChart(d3.select('#spiral-hist'));
        this.power_chart = new Chart.LineChart(d3.select('#spiral-power'));

        this.hist_chart.chartHeight = 200;
        this.power_chart.chartHeight = 200;

        this._hist_fn = d3.layout.histogram<TimedDataRow>()
            .value(x => x.date.valueOf())
            .bins(2049);

        // constructor function
        var that = this;
        d3.select('#spiral-slider').on('input', function() {
            let s = 1. / this.value;
            that.chart.period_seconds = s * 3600 * 24;
            that.chart.update(that._data);
            d3.select('#spiral-value').html('Period: ' + s.toString() + 'days');
        });

        d3.select('#spiral-slider')
            .style('width', '730px')
            .style('margin-left', '50px');
    }

    public set data(d: IDataRow[]) {
        // function used to bind data to this object
        this._data = d.map((d) => new TimedDataRow(d));
//        console.log(TimedDataRow.color_map);
        var min_date = Math.min.apply(null, this._data.map((d) => d.date));
        var max_date = Math.max.apply(null, this._data.map((d) => d.date));
//        console.log(new Date(min_date));
        this.chart.time_scale = d3.time.scale().range([0, 1]).domain([min_date, max_date]);
        this.chart.radius_map = (d: TimedDataRow) => 5;
        //this.chart.period_fraction = 1 / 5;
        this.chart.period = d3.time.day;

        this.histogram = this._hist_fn(this._data).slice(1);
        this._hist_data = this.histogram.map(
            a => new Cartesian((a.x + a.dx / 2) / (1000 * 3600 * 24), a.y));

        let N = this._hist_data.length;
        let L = (this.histogram[this.histogram.length - 1].x - this.histogram[0].x)
            / (1000 * 3600 * 24);
        let kspace = function(i: number): number {
            if (i <= N / 2) {
                return i / L;
            } else {
                return (i - N) / L;
            }
        };

        this._power_data = FFT.fft(this._hist_data.map(a => new complex(a.y, 0)))
            .map((y, x) => new Cartesian(kspace(x), y.norm2() * Math.PI / N));
//        console.log(this.histogram[0].dx);

        d3.select('#spiral-slider')
            .attr('max', kspace(N / 2));
    }

    public get data(): IDataRow[] {
        return this._data.map((d) => d.record);
    }

    public render() {
        this.chart.data = this._data;
        this.chart.render();
        this.hist_chart.render(this._hist_data);
        this.power_chart.render(this._power_data.slice(1, this._power_data.length / 2));
    }
}

