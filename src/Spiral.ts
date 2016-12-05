import 'd3';

import { TimedDataRow}       from './TimedDataRow';
import { TimedBubbleSpiral } from './TimedBubbleSpiral';
// IDataRow probably should be TimedRecord or something
import { LineChart }         from './LineChart';
import { Coordinate }        from './basechart';
import { Cartesian }         from './basechart';
import { fft }               from './fourier';
import { Complex }           from './Complex';


class Spiral {
    public _data: TimedDataRow[];
    public chart: TimedBubbleSpiral<IDataRow>;
    private hist_chart: LineChart;
    private power_chart: LineChart;

    private histogram: any;
    private _hist_fn: d3.layout.Histogram<TimedDataRow>;
    private _hist_data: Coordinate[];
    private _power_data: Coordinate[];

    constructor (id_tag: string) {
        this.chart = new TimedBubbleSpiral<IDataRow>(d3.select('#' + id_tag));
        this.hist_chart = new LineChart(d3.select('#spiral-hist'));
        this.power_chart = new LineChart(d3.select('#spiral-power'));

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

        this._power_data = fft(this._hist_data.map(a => new Complex(a.y, 0)))
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
