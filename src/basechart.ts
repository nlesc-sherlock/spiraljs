import 'd3';

export interface Coordinate {
    x: number;
    y: number;
}

export class Cartesian implements Coordinate {
    constructor(public x: number, public y: number) {}
}

export class Polar implements Coordinate {
    constructor (public r: number, public phi: number) {}
    get x() { return this.r * Math.cos(this.phi); }
    get y() { return this.r * Math.sin(this.phi); }

    public inc_r(dr: number): Polar {
        return new Polar(this.r + dr, this.phi);
    }
}

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface HistogramOutput {
    x: number;
    dx: number;
    y: number;
}

export abstract class Base<T> {
    public chartWidth = 800;
    public chartHeight = 600;
    public element: d3.Selection<any>;

    constructor (element: d3.Selection<any>) {
        this.element = element;
    }

    public render(data: T[]): d3.Selection<any> {
        return null;
    }
}

