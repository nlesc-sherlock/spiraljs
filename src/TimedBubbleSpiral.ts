//import * as d3 from 'd3';
import * as d3Time from 'd3-time';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import { ITimedRecord } from './ITimedRecord';
import { LineSpiral } from './LineSpiral';

export class TimedBubbleSpiral<T> extends LineSpiral<ITimedRecord<T>> {
    private _period: d3Time.TimeInterval;
    public time_scale: d3Scale.ScaleTime<number, number>;
    public color_map = (d: ITimedRecord<T>) => {
        if (d.color) {
            return d.color;
        } else {
            return 'red';
        }
    };

    constructor (element: d3.Selection<any, any, any, any>) {
        super(element);
    }

    public radial_map = (x: ITimedRecord<T>) => {
        return this.time_scale(x.date);
    };

    set period(p: d3Time.TimeInterval) {
        this._period = p;

        const zero = this.time_scale.invert(0);
        this.period_fraction = this.time_scale(p.offset(zero, 1));
    }

    get period(): d3Time.TimeInterval {
        return this._period;
    }

    set period_seconds(p: number) {
        const zero = this.time_scale.invert(0);
        const iv = d3Time.timeSecond.offset(zero, p);
        this.period_fraction = this.time_scale(iv);
    }

    public label_map(d: ITimedRecord<T>): string {
        return d.date.toDateString();
    }

    public render(): d3.Selection<any, any, any, any> {
        const plot = super.render();
        this.add_axis(
            plot,
            d3Array.range(16).map((i) => i / 8 * Math.PI - Math.PI / 2),
            d3Array.range(16).map((i) => (i / 8).toString() + 'π'));
        return plot;
    }
}
