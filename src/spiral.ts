/// <reference path="basechart.ts" />
/// <reference path="linechart.ts" />
/// <reference path="dsp.ts" />

import complex = Complex.Complex;

interface TimedRecord<T> {
    date:   Date;
    record: T;
    color?: string;
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




