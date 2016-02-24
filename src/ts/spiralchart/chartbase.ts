/// <reference path="../../../typings/d3/d3.d.ts" />

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
        return new Polar(this.r + dr, this.phi);
    }
}

interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface HistogramOutput {
    x: number;
    dx: number;
    y: number;
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
}
