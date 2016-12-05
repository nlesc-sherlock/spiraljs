/// <reference path="basechart.ts" />
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

    // this used to have the following classes:
    // LineSpiral
    // SpiralBase
    // BubbleSpiral

}

function modulo(x: number, y: number): number {
    if (x >= 0) {
        return x % y;
    } else {
        return y - (x % y);
    }
}




