/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="chartbase.ts" />

module Chart {
    export class LineChart extends Base<Coordinate> {
        public margin: Margin;

        constructor (element: d3.Selection<any>) {
            super(element);
            this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        }

        public get width(): number {
            return this.chartWidth - this.margin.left - this.margin.right;
        }
        public get height(): number {
            return this.chartHeight - this.margin.top - this.margin.bottom;
        }

        public render(data: Coordinate[]): d3.Selection<any> {
            var x = d3.scale.linear().range([0, this.width]);
            var y = d3.scale.linear().range([this.height, 0]);
            var xAxis = d3.svg.axis().scale(x).orient('bottom');
            var yAxis = d3.svg.axis().scale(y).orient('left');
            var svg = this.element.append('svg')
                .attr('width', this.chartWidth)
                .attr('height', this.chartHeight)
                .append('g')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            x.domain(d3.extent(data, a => a.x));
            y.domain(d3.extent(data, a => a.y));

            var line = d3.svg.line<Coordinate>()
                .x(a => x(a.x))
                .y(a => y(a.y));

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);

            svg.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line);

            return svg;
        }
    }
}
