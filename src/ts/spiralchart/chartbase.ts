/// <reference path="../../../typings/d3/d3.d.ts" />

/**
 * Common interface for Charts
 */

/**
 * Coordinate on screen, should have 'x' and 'y' members.
 */
interface Coordinate {
    x: number;
    y: number;
}

/**
 * Implements [Coordinate] in most straight forward manner.
 */
class Cartesian implements Coordinate {
    constructor(public x: number, public y: number) {}
}

/**
 * Polar implementation of [Coordinate].
 */
class Polar implements Coordinate {
    constructor (public r: number, public phi: number) {}
    get x() { return this.r * Math.cos(this.phi); }
    get y() { return this.r * Math.sin(this.phi); }

    /**
     * increment the radius of the polar coordinate.
     *
     * @param dr: radius increment.
     */
    public inc_r(dr: number): Polar {
        return new Polar(this.r + dr, this.phi);
    }
}

/**
 * Interface for margin specification.
 */
interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * Interface for the output of a histogram function.
 *
 * @property *x*    left bound of bin
 * @property *dx*   bin width
 * @property *y*    count
 */
interface HistogramOutput {
    x: number;
    dx: number;
    y: number;
}

module Chart {
    /**
     * Abstract base class for charts.
     *
     * Whenever we expect a chart class to implement some function,
     * it should be present in this class. The class is templated
     * to typename 'T', which is the datatype to this chart. A list
     * of 'T' is passed to the 'render' method.
     */
    export abstract class Base<T> {
        public chartWidth = 800;
        public chartHeight = 600;

        /**
         * The chart constructor should accept a [d3.Selection] to render
         * into. For example, we have the plot end up in a div with a known
         * id, then the constructor is called with <code>d3.select('#chart-id')</code>.
         */
        constructor (public element: d3.Selection<any>) {}

        /**
         * Proceed to render the chart using 'data'.
         */
        public render(data: T[]): d3.Selection<any> {
            return null;
        }
    }
}
