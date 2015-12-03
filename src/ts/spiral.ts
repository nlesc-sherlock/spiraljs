///<reference path='../../typings/d3/d3.d.ts'/>

interface TimedRecord<T> {
    date:   Date;
    record: T;
}

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
        this.r += dr;
        return this;
    }
}

module Chart {
    export class Base {
        public chartWidth = 800;
        public chartHeight = 600;
        
        constructor (public element: d3.Selection<any>) {}
        
        /** Renders the chart using the specified data.
         *  @param data The dataset
         */
        public render<T>(data: T[]) {}
    }

    export class BubbleSpiral<T> extends Base {
        public radial_map: (x: T)=>number;
        
        // should return a number between 0 and 1
        public radial_scale: number;
        
        // the fraction of one turn against the entire range
        public period_fraction: number;
        
        public radius_map: (x: T)=>number;

        private angular_map(x: T) {
            return modulo(this.radial_map(x), this.period_fraction) /
                this.period_fraction * 2 * Math.PI;
        }
              
        public line_tics;
        
        constructor (element: d3.Selection<any>) {
            super(element);
            this.radial_scale = this.chartHeight / 2;
        }

        public get_label(d: T): string {
            return "";
        }
        
        private get_polar(d: T): Polar {
            return new Polar(Math.sqrt(this.radial_map(d)*0.9 + 0.1) * this.radial_scale, 
                             this.angular_map(d));
        }
        
        private render_spiral_axis(
                plot: d3.Selection<any>, 
                pts: T[], 
                tics_data?: T[]) {
                    
            var group = plot.append('g')
                .attr('class', 'axis');
            
            var line = d3.svg.line<T>()
                .x((d, i) => this.get_polar(d).x)
                .y((d, i) => this.get_polar(d).y)
                .interpolate('basis');
                
            var axis = group.append('path')
                .datum(pts)
                .attr('class', 'line')
                .attr('d', line)
                .style('fill', 'none')
                .style('stroke', '#888')
                .style('stroke-width', 0.5)
            
            if (tics_data) {
                var tics = group.selectAll('g.tic')
                    .data(tics_data)
                    .enter().append('g')
                    .attr('class', 'tic')
                    
                tics.append('line')
                    .attr('x1', (d, i) => this.get_polar(d).inc_r(-3).x)
                    .attr('y1', (d, i) => this.get_polar(d).inc_r(-3).y)
                    .attr('x2', (d, i) => this.get_polar(d).inc_r(+3).x)
                    .attr('y2', (d, i) => this.get_polar(d).inc_r(+3).y)
                    .style('stroke', '#888')
                    .style('stroke-width', 0.5)
                    
                tics.append('text')
                    .attr('x', (d, i) => this.get_polar(d).inc_r(+3).x)
                    .attr('y', (d, i) => this.get_polar(d).inc_r(+3).y)
                    .attr('font-size', '10')
                    .attr('font-family', 'Vollkorn')
                    .text((d, i) => this.get_label(d))
            }
            return group;
        }
        
        /** Render the SpiralBubbleChart
         * @param data The dataset
         * @param axis_points? Points to draw the spiral-axis.
         * @param tics_points? Points at which to set a tic with label
         */       
        public render(data: T[], axis_points?: T[], tics_points?: T[]) {
            var svg = this.element.append('svg')
                        .attr('height', this.chartHeight)
                        .attr('width', this.chartWidth);
            
            var plot = svg.append('g')
                .attr('transform', 'translate(400 300)');
            
            if (axis_points) {
                this.render_spiral_axis(plot, axis_points, tics_points)
            }
            
            var bubble_groups = plot.append('g').selectAll('g.bubble')
                .data(data)
                .enter().append('g')
                .attr('class', 'bubble');
            
            bubble_groups.append('circle')
                .attr('cx', (d, i) => this.get_polar(d).x)
                .attr('cy', (d, i) => this.get_polar(d).y)
                .attr('r', (d, i) => this.radius_map(d))
                .style('fill', 'red')
                .style('fill-opacity', 0.6);
        }
    }
}

function modulo(x: number, y: number): number {
    if (x >= 0) return x % y;
    else return y - (x % y);
}

class TimedBubbleSpiral<T> extends Chart.BubbleSpiral<TimedRecord<T>> {
    private _period: d3.time.Interval;
    public time_scale: d3.time.Scale<number, number>;
    
    constructor (element: d3.Selection<any>) {
        super(element);
    }
    
    public radial_map = function (x: TimedRecord<T>) { 
        return this.time_scale(x.date);
    }
    
    set period(p: d3.time.Interval) {
        this._period = p;
        
        var zero = this.time_scale.invert(0);
        this.period_fraction = this.time_scale(p.offset(zero, 1));
    }
    
    get period(): d3.time.Interval {
        return this._period;
    }
    
    public get_label(d: TimedRecord<T>): string {
        return d.date.toDateString();
    }
}

class TestRecord<T> implements TimedRecord<T> {
    constructor (public date: Date, public record: T) {}
}

function random_timed_data(
        n: number, 
        date_scale: d3.time.Scale<number,number>): TestRecord<number>[] {                            
    var value_scale = d3.scale.linear()
                              .range([-1, 1])
                              .domain([0.5, 2.5]);

    function random_record(): TestRecord<number> {
        return new TestRecord<number>(
            date_scale.invert(Math.random()),
            Math.pow(value_scale.invert(d3.random.normal()()), 2)
        );
    }
    
    return d3.range(n).map(random_record);
}

function is_sunday(date: Date): boolean {
    return date.getDay() == 0;
}

function is_tuesday(date: Date): boolean {
    return date.getDay() == 2;
}


var date_scale = d3.time.scale()
        .range([0, 1.0])
        .domain([new Date(2012, 1, 1), new Date()]);
        
var dataset = random_timed_data(1000, date_scale).filter(
    (x) => !(is_sunday(x.date) || is_tuesday(x.date))); 

var axis_data = d3.range(10000).map(
    (i) => new TestRecord<number>(date_scale.invert(i/10000), 0));

var tics_data = d3.range(17).map(
    (i) => new TestRecord<number>(date_scale.invert(i/17), 0));

document.addEventListener('DOMContentLoaded', function () {
    d3.select('#greeter').append("p").html("This is a spiral");
    var chart = new TimedBubbleSpiral<number>(d3.select('#spiralchart'));
    chart.time_scale = date_scale.range([0,1]);
    chart.radius_map = (x: TestRecord<number>) => x.record;
    chart.period = d3.time.week;
    //chart.period_fraction = 1/5;
    
    chart.render(dataset, axis_data, tics_data);
});


class TimedDataRow implements TimedRecord<IDataRow> {
    private _row: IDataRow;
    
    constructor (r: IDataRow) {
        this._row = r;    
    }
    
    get date(): Date { return new Date(this._row.datestr); }
    get record(): IDataRow { return this._row; }
}

class Spiral {
    private _data: TimedDataRow[];
    private chart: TimedBubbleSpiral<TimedDataRow>;

    constructor (id_tag: string) {
        this.chart = new TimedBubbleSpiral<TimedDataRow>(d3.select('#'+id_tag));
        // constructor function
    }

    public set data(d: IDataRow[]) {
        // function used to bind data to this object
        this._data = d.map((d) => new TimedDataRow(d));
    }
    
    public get data(): IDataRow[] {
        return this._data.map((d) => d.record);
    }
}

