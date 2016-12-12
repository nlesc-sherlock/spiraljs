import { Selection } from 'd3-selection';

export interface ICoordinate {
    x: number;
    y: number;
}

export class Cartesian implements ICoordinate {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Polar implements ICoordinate {
    public r: number;
    public phi: number;

    constructor (r: number, phi: number) {
        this.r = r;
        this.phi = phi;
    }

    get x() { return this.r * Math.cos(this.phi); }
    get y() { return this.r * Math.sin(this.phi); }

    public inc_r(dr: number): Polar {
        return new Polar(this.r + dr, this.phi);
    }
}

export interface IMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IHistogramOutput {
    x: number;
    dx: number;
    y: number;
}

export abstract class Base<T> {
    public chartWidth = 800;
    public chartHeight = 600;

    /**
     * Refers to the `d3.Selection` containing the element that is being
     * drawn to.
     */
    public element: Selection<any, any, any, any>;

    constructor (element: Selection<any, any, any, any>) {
        this.element = element;
    }

    public render(_: T[]): Selection<any, any, any, any> {
        return null;
    }
}
