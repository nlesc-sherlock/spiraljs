
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
    private _buttonWidth  : number;
    private _buttonHeight : number;

    constructor (size:ISize, padding:IPadding, histogram: Histogram) {
        // constructor method

        // set the colors to use for the heatmap
        this.cLimLowColor  = [  0, 128, 255];
        this.cLimHighColor = [255,   0,   0];

        // set the button dimensions:
        this.buttonWidth = 50;
        this.buttonHeight = 20;

        // tie histogram to the instance
        this.histogram = histogram;

        this.initializeElements();

        this.drawSvgElem(size);
        this.drawBackground();
        this.drawAxisHorizontal();
        this.drawAxisVertical();
        this.drawHeatmap();
        this.drawButtonLeftArrowLeft();
        this.drawButtonLeftArrowRight();
        this.drawButtonRightArrowLeft();
        this.drawButtonRightArrowRight();
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

            return 'rgb(' + Math.floor(color[0]) + ',' +
                             Math.floor(color[1]) + ',' +
                             Math.floor(color[2]) + ')';
        } else {
            return 'rgb(0,0,0)';
        }

    } // end method calcColor()




    private drawAxisHorizontal() {
        // draw the horizontal axis

        let myOffsetMinutes = (new Date()).getTimezoneOffset();
        let theirOffsetMinutes = histogram.countData[0].dateFrom.utcOffset();
        let offsetMinutes:number = myOffsetMinutes + theirOffsetMinutes;

        this.dateScale = d3.time.scale()
            .domain([this.histogram.xDomainFrom.clone().add(offsetMinutes, 'minutes').toDate(),
                     this.histogram.xDomainTo.clone().add(offsetMinutes, 'minutes').toDate()])
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




    private calcTenPercentDuration() {

        let f: moment.Moment;
        let l: moment.Moment;
        let d: number;
        let d10: number;

        f = this.histogram.dateTimeFirst;
        l = this.histogram.dateTimeLast;
        d = l.diff(f, 'days');
        d10 = Math.floor(Math.max(1, d * 0.10));

        console.log(d10);
    }




    private drawButton(offsetX: number, offsetY: number, arrowDirection: string, s: string) {

        // draw button
        var button,
            that;

        // select the chart elem, append an svg group, assign it 'button' class
        button = this.elements.chart.elem.append('g')
            .attr('class', 'button')
            .attr('transform', 'translate(' + offsetX + ',' + offsetY + ')');


        // capture the this object:
        that = this;

        let h:number = this.buttonHeight;
        let w:number = this.buttonWidth;
        let r:number = 4;
        let d:number;

        if (arrowDirection === 'left') {
            d = -1;
        } else if (arrowDirection === 'right') {
            d = 1;
        } else {
            console.error('Unrecognized arrow direction string.');
        }

        // append a rect to the button variable
        button.append('rect')
            .attr('width', w)
            .attr('height', h)
            .attr('rx', r)
            .attr('ry', r);

        // add an arrow to the button
        button.append('path')
            .attr('d', 'M ' + (this.buttonWidth * 0.50 + -1 * d * this.buttonWidth * 0.125) + ' ' + this.buttonHeight * 0.25 + ' ' +
                       'L ' + (this.buttonWidth * 0.50 + d * this.buttonWidth * 0.125) + ' ' + this.buttonHeight * 0.50 + ' ' +
                       'L ' + (this.buttonWidth * 0.50 + -1 * d * this.buttonWidth * 0.125) + ' ' + this.buttonHeight * 0.75 + ' ' +
                       'Z')
                .style('stroke-width', 0)
                .style('stroke', 'black')
                .style('fill', '#333');

        // add an onclick method to the button group
        button
            .on('click', function () {that.calcTenPercentDuration(); });


    }




    private drawButtonLeftArrowLeft() {
        // draw button on the left of the timeline with an arrow pointing left

        let offsetX: number;
        let offsetY: number;

        offsetX = 0 - this.buttonWidth - 5;
        offsetY = -1 * this.buttonHeight - 15;

        this.drawButton(offsetX, offsetY, 'left', 'left, left');
    }




    private drawButtonLeftArrowRight() {
        // draw button on the left of the timelin with an arrow pointing right

        let offsetX: number;
        let offsetY: number;

        offsetX = 0 + 5;
        offsetY = -1 * this.buttonHeight - 15;

        this.drawButton(offsetX, offsetY, 'right', 'left, right');
    }




    private drawButtonRightArrowLeft() {
        // draw button on the right of the timeline with an arrow pointing left

        let offsetX: number;
        let offsetY: number;

        offsetX = this.elements.chart.size.width - this.buttonWidth - 5;
        offsetY = -1 * this.buttonHeight - 15;

        this.drawButton(offsetX, offsetY, 'left', 'right, left');
    }




    private drawButtonRightArrowRight() {
        // draw button on the right of the timeline with an arrow pointing right

        let offsetX: number;
        let offsetY: number;

        offsetX = this.elements.chart.size.width + 5;
        offsetY = -1 * this.buttonHeight - 15;

        this.drawButton(offsetX, offsetY, 'right', 'right, right');
    }




    // private drawButtonLeftArrowRight() {
    //     // draw button on the left of the timeline
    //     var button,
    //         that;
    //
    //     // select the chart elem, append an svg group, assign it 'button' class
    //     button = this.elements.chart.elem.append('g').attr('class', 'button');
    //
    //     // capture the this object:
    //     that = this;
    //
    //     let h:number = 20;
    //     let w:number = 50;
    //     let r:number = 4;
    //
    //
    //
    //     // append a rect to the button variable
    //     button.append('rect')
    //         .attr('x', 10)
    //         .attr('y', -h - 5)
    //         .attr('width', w)
    //         .attr('height', h)
    //         .attr('rx', r)
    //         .attr('ry', r)
    //         .on('click', function () {console.log(that.histogram.dateTimeFirst); });
    //
    // }
    //
    //
    //
    //
    // private drawButtonRight() {
    //     // draw button on the right of the timeline
    //
    //     // select the chart elem, append an svg group, assign it 'button' class
    //     var button = this.elements.chart.elem.append('g').attr('class', 'button');
    //
    //     let h:number = 20;
    //     let w:number = 50;
    //     let r:number = 4;
    //
    //     // append a rect to the button variable
    //     button.append('rect')
    //         .attr('x', this.elements.chart.size.width - w - 10)
    //         .attr('y', -h - 5)
    //         .attr('width', w)
    //         .attr('height', h)
    //         .attr('rx', r)
    //         .attr('ry', r)
    //         .on('click', function () {console.log('right'); });
    // }
    //



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

        let myOffsetMinutes = (new Date()).getTimezoneOffset();

        let calcLeftOfRect = function (d:any) {
            let theirOffsetMinutes:number = d.dateFrom.utcOffset();
            let offsetMinutes:number = myOffsetMinutes + theirOffsetMinutes;
            return that.dateScale(d.dateFrom.clone().add(offsetMinutes, 'minutes').toDate());
        };

        heatmap.selectAll('rect').data(this.histogram.countData).enter().append('rect')
            .attr('x', calcLeftOfRect)
            .attr('y', function (d:any) {return that.todScale(d.todFrom); })
            .attr('width', function () {return that.elements.chart.size.width / that.histogram.xDomainExtent; })
            .attr('height', function () {return that.elements.chart.size.height / that.histogram.yDomainExtent; })
            .attr('fill', function (d:any) {return that.calcColor(that.histogram.min, that.histogram.max, d.count); })
            .attr('fill-opacity', function (d:any) {return d.count ? 1.0 : 0.0; })
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
        var padding = {top: 60, right: 100, bottom: 100, left: 100};

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

    private get buttonWidth():number {
        return this._buttonWidth;
    }

    private set buttonWidth(buttonWidth:number) {
        this._buttonWidth = buttonWidth;
    }

    private get buttonHeight():number {
        return this._buttonHeight;
    }

    private set buttonHeight(buttonHeight:number) {
        this._buttonHeight = buttonHeight;
    }

}


