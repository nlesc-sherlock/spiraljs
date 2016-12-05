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
