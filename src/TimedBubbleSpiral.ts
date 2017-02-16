import * as d3 from 'd3';

import { BubbleSpiral } from './BubbleSpiral';
import { ITimedRecord } from './ITimedRecord';

export class TimedBubbleSpiral<T> extends BubbleSpiral<ITimedRecord<T>> {
    private _period: d3.time.Interval;
    public time_scale: d3.time.Scale<number, number>;
    public color_map = (d: ITimedRecord<T>) => {
        if (d.color) {
            return d.color;
        } else {
            return 'red';
        }
    };

    constructor (element: d3.Selection<any>) {
        super(element);
    }

    public x_map = (x: ITimedRecord<T>) => {
        return x.date.valueOf();
    }

    public x_radial_map = (x: number) => {
        return this.time_scale(new Date(x));
    };

    set period(p: d3.time.Interval) {
        this._period = p;

        const zero = this.time_scale.invert(0);
        this.period_fraction = this.time_scale(p.offset(zero, 1));
    }

    get period(): d3.time.Interval {
        return this._period;
    }

    set period_seconds(p: number) {
        const zero = this.time_scale.invert(0);
        const iv = d3.time.second.offset(zero, p);
        this.period_fraction = this.time_scale(iv);
    }

    public label_map(n: number): string {
        const d = new Date(n);
        return d.toDateString() + '\n' + d.toTimeString();
    }

    public render(data: ITimedRecord<T>[]): d3.Selection<any> {
        const plot = super.render(data);
        this.add_axis(
            plot,
            d3.range(16).map((i) => i / 8 * Math.PI - Math.PI / 2),
            d3.range(16).map((i) => (i / 8).toString() + 'π'));
        return plot;
    }
}
