import * as d3 from 'd3';

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
    y: any;
}

export abstract class Base<T> {
    public chartWidth = 800;
    public chartHeight = 600;

    /**
     * Refers to the `d3.Selection` containing the element that is being
     * drawn to.
     */
    public element: d3.Selection<any>;

    constructor (element: d3.Selection<any>) {
        this.element = element;
    }

    public render(_: T[]): d3.Selection<any> {
        return null;
    }
}

export function group_by<T>(f: (d: T) => string, data: T[]): {[key: string]: T[]} {
    type Groups = {[key: string]: T[]};

    return data.reduce(
        (r: Groups, d: T): Groups => {
            const k: string = f(d);

            if (k in r) {
                r[k].push(d);
            } else {
                r[k] = [d];
            }

            return r;
        },
        {});
}
