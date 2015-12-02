
/// <reference path="../../typings/tsd.d.ts" />

interface ITranslation {
    down: number;
    left: number;
}

interface ISize {
    width : number;
    height: number;
}

interface IPadding {
    top   : number;
    right : number;
    bottom: number;
    left  : number;
}

interface IDomElement {
    elem       : any;
    translation: ITranslation;
    size       : ISize;
    padding    : IPadding;
}

interface IDomElements {
    svg  : IDomElement;
    chart: IDomElement;
}


class Timeline {
    private _chartGroup   : any;
    private _cLimHighColor: Array<number>;
    private _cLimLowColor : Array<number>;
    private _dateScale    : any;
    private _elements     : IDomElements;
    private _histogram    : Histogram;
    private _todScale     : any;

    constructor (size:ISize, padding:IPadding, histogram: Histogram) {
        // constructor method

        // set the colors to use for the heatmap
        this.cLimLowColor  = [  0, 128, 255];
        this.cLimHighColor = [255,   0,   0];

        // tie histogram to the instance
        this.histogram = histogram;

        this.initializeElements();

        this.drawSvgElem(size);
        this.drawBackground();
        this.drawAxisHorizontal();
        this.drawAxisVertical();
        this.drawHeatmap();
        this.drawLegend();
        this.drawXLabel();
        this.drawYLabel();
        this.drawTitle();
    }




    private calcColor(cLimLow:number, cLimHigh:number, actualValue:number) {

        let color: Array<number>;
        let iElem: number;
        let unitValue: number;

        if (actualValue !== null) {

            color = [null, null, null];

            unitValue = (actualValue - cLimLow) / (cLimHigh - cLimLow);

            for (iElem = 0; iElem < 3; iElem += 1) {
                color[iElem] = this.cLimLowColor[iElem] + (this.cLimHighColor[iElem] - this.cLimLowColor[iElem]) * unitValue;
            }

            return 'rgba(' + Math.floor(color[0]) + ',' +
                             Math.floor(color[1]) + ',' +
                             Math.floor(color[2]) + ', 255)';
        } else {
            return 'rgba(0,0,0,0)';
        }

    } // end method calcColor()




    private drawAxisHorizontal() {
        // draw the horizontal axis
        // FIXME some weird shiznit is happening here.
        this.dateScale = d3.time.scale.utc()
            .domain([new Date(this.histogram.xDomainFrom.clone().utc().toString()),
                     new Date( this.histogram.xDomainTo.clone().utc().toString())])
            .range([0, this.elements.chart.size.width]);

        // create an axis object for the date
        var dateAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dateScale)
            .ticks(5);

        // add the date axis group to the chart
        this.elements.chart.elem
            .append('g')
                .attr('class', 'dateAxisGroup')
                .attr('transform', 'translate(0,' + this.elements.chart.size.height + ')')
                .call(dateAxis);

    }; // end method drawAxisHorizontal()




    private drawAxisVertical() {
        // draw the horizontal axis
        this.todScale = d3.scale.linear()
            .domain([this.histogram.yDomainFrom, this.histogram.yDomainTo])
            .range([0, this.elements.chart.size.height]);

        // create an axis object for the time of day
        var todAxis = d3.svg.axis()
            .orient('left')
            .scale(this.todScale);

        // add the time of day axis group to the chart
        this.elements.chart.elem
            .append('g')
                .attr('class', 'todAxisGroup')
                .attr('transform', 'translate(0,0)')
                .call(todAxis);

    }; // end method drawAxisVertical()




    private drawBackground() {
        // draw background
        var translation = {
            left: this.elements.svg.padding.left,
            down: this.elements.svg.padding.top
        };
        var size = {
            width : this.elements.svg.size.width -
                    this.elements.svg.padding.left -
                    this.elements.svg.padding.right,
            height: this.elements.svg.size.height -
                    this.elements.svg.padding.top -
                    this.elements.svg.padding.bottom
        };
        var padding = {
            top    : 10,
            right  : 10,
            bottom : 10,
            left   : 10
        };

        var elem = this.elements.svg.elem
            .append('g')
                .attr('class', 'chart');

        elem.attr('transform', 'translate(' + translation.left + ',' + translation.down + ')');

        // set the width and height of the chart background
        elem.append('rect')
            .attr('width', size.width)
            .attr('height', size.height)
            .attr('class', 'background');

        this.elements.chart = {
            elem: elem,
            translation: translation,
            size: size,
            padding: padding
        };

    } // end method drawBackground()




    private drawHeatmap() {
        // draw heatmap based on this.histogram data

        // create the heatmap by adding colored rectangles to the chart
        var heatmap = this.elements.chart.elem
            .append('g').attr('class', 'heatmap');

        // capture the 'this' object
        //    alternatively, you could use fat arrow notation
        //    () => {console.log(this)}
        //    instead of
        //    var that = this;
        //    and
        //    function(){console.log(that)}
        var that = this;

        heatmap.selectAll('rect').data(this.histogram.countData).enter().append('rect')
            .attr('x', function (d:any) {return that.dateScale(d.dateFrom); })
            .attr('y', function (d:any) {return that.todScale(d.todFrom); })
            .attr('width', function () {return that.elements.chart.size.width / that.histogram.xDomainExtent; })
            .attr('height', function () {return that.elements.chart.size.height / that.histogram.yDomainExtent; })
            .attr('fill', function (d:any) {return that.calcColor(that.histogram.min, that.histogram.max, d.count); })
            .attr('class', 'histogram');

        // retieve the data associated with the element that the user clicked
        heatmap.selectAll('rect.histogram')
            .on('click', function (d:any) {console.log(d); });


    } // end method drawHeatmap()




    private drawLegend() {
        // draw figure legend

        // capture the 'this' object
        //    alternatively, you could use fat arrow notation
        //    () => {console.log(this)}
        //    instead of
        //    var that = this;
        //    and
        //    function(){console.log(that)}
        var that = this;
        let left:number = this.elements.chart.size.width + 0.5 * this.elements.chart.padding.right;
        let top:number = 0.6 * this.elements.chart.size.height;
        this.elements.chart.elem
            .append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (left) + ',' + top + ')');

        this.elements.chart.elem.select('g.legend')
                .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('class', 'legend-min')
                    .attr('fill', function (d:any) {
                        return that.calcColor(that.histogram.min, that.histogram.max, that.histogram.min);
        });

        this.elements.chart.elem.select('g.legend')
                .append('text')
                    .attr('x', 30)
                    .attr('y', 15)
                    .attr('text-anchor', 'start')
                    .attr('alignment-baseline', 'baseline')
                    .attr('class', 'legend-min')
                    .text('min: ' + this.histogram.min);

        this.elements.chart.elem.select('g.legend')
                .append('rect')
                    .attr('x', 0)
                    .attr('y', 30)
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('class', 'legend-max')
                    .attr('fill', function (d:any) {
                        return that.calcColor(that.histogram.min, that.histogram.max, that.histogram.max);
                    });

        this.elements.chart.elem.select('g.legend')
                .append('text')
                    .attr('x', 30)
                    .attr('y', 45)
                    .attr('text-anchor', 'start')
                    .attr('alignment-baseline', 'baseline')
                    .attr('class', 'legend-max')
                    .text('max: ' + this.histogram.max);

    } // end method drawLegend()




    private drawSvgElem(size:ISize) {
        // append an svg element to the timeline div
        var elem = d3.select('#timeline')
            .append('svg')
                .attr('class', 'svg')
                .attr('width', size.width)
                .attr('height', size.height);

        var translation = {left: 0, down: 0};
        var padding = {top: 30, right: 100, bottom: 100, left: 100};

        this.elements.svg = {
            elem: elem,
            translation: translation,
            size: size,
            padding: padding
        };

    } // end method appendSvgElem()




    private drawTitle() {
        // draw figure title
        let left:number = this.elements.chart.size.width / 2;
        let top: number = -this.elements.svg.padding.top / 2;
        this.elements.chart.elem
            .append('g')
                .attr('class', 'title')
                    .attr('transform', 'translate(' + left  + ', ' + top + ')')
                    .append('text')
                    .text('Number of records: ' + this.histogram.numberOfRecords)
                    .attr('text-anchor', 'middle');

    } // end method drawTitle()




    private drawXLabel() {
        // draw figure xlabel
        let left:number = this.elements.chart.size.width / 2;
        let top:number = this.elements.chart.size.height + this.elements.svg.padding.bottom / 2;
        this.elements.chart.elem
            .append('g')
                .attr('class', 'xlabel')
                .attr('transform', 'translate(' + left  + ', ' + top + ')')
                .append('text')
                    .text('date')
                    .attr('text-anchor', 'middle');
    } // end method drawXLabel()




    private drawYLabel() {
        // draw figure ylabel
        let left: number = this.elements.svg.padding.left / 2;
        let top:number = this.elements.chart.size.height / 2;
        this.elements.chart.elem
            .append('g')
                .attr('class', 'ylabel')
                .attr('transform', 'translate(' + (-left) + ', ' + top  + ') rotate(-90)')
                .append('text')
                    .text('time of day')
                    .attr('text-anchor', 'middle');
    } // end method drawYLabel()




    private initializeElements() {
        this.elements = {
            svg: null,
            chart: null
        };
    } // end method initializeElements()




    // getters and setters
    private get chartGroup():any {
        return this._chartGroup;
    }

    private set chartGroup(chartGroup:any) {
        this._chartGroup = chartGroup;
    }

    public get cLimHighColor():Array<number> {
        return this._cLimHighColor;
    }

    public set cLimHighColor(cLimHighColor:Array<number>) {
        this._cLimHighColor = cLimHighColor;
    }

    public get cLimLowColor():Array<number> {
        return this._cLimLowColor;
    }

    public set cLimLowColor(cLimLowColor:Array<number>) {
        this._cLimLowColor = cLimLowColor;
    }

    private get dateScale():any {
        return this._dateScale;
    }

    private set dateScale(dateScale:any) {
        this._dateScale = dateScale;
    }

    private get elements():IDomElements {
        return this._elements;
    }

    private set elements(elements:IDomElements) {
        this._elements = elements;
    }

    private get histogram():Histogram {
        return this._histogram;
    }

    private set histogram(histogram:Histogram) {
        this._histogram = histogram;
    }

    private get todScale():any {
        return this._todScale;
    }

    private set todScale(todScale:any) {
        this._todScale = todScale;
    }

}


