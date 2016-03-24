
/// <reference path="../../../typings/d3/d3.d.ts" />


class Heatmap {

    private _buttonHeight : number;
    private _buttonWidth  : number;
    private _cLimHighColor: Array<number>;
    private _cLimLowColor : Array<number>;
    private _dateScale    : d3.time.Scale<number, number>;
    private _domElem      : HTMLElement;
    private _domElemId    : string;
    private _histogram    : Histogram;
    private _paddingBottom: number;
    private _paddingLeft  : number;
    private _paddingRight : number;
    private _paddingTop   : number;
    private _svg          : d3.Selection<any>;
    private _todScale     : d3.scale.Linear<number, number>;

    constructor (domElemId:string, histogram: Histogram) {
        // constructor method

        this._domElemId = domElemId;
        this._domElem = document.getElementById(this._domElemId);

        // set the colors to use for the heatmap
        this.cLimLowColor  = [  0, 128, 255];
        this.cLimHighColor = [255,   0,   0];


        // tie histogram to the instance
        this.histogram = histogram;

        // set the button dimensions:
        this.buttonWidth = 50;
        this.buttonHeight = 20;

        // set the padding to each side of the chart
        this.paddingLeft = 100;
        this.paddingRight = 120;
        this.paddingTop = 60;
        this.paddingBottom = 90;

        // now start the actual drawing of stuff
        this.draw();

        // beware: JavaScript magic happens here
        let that:Heatmap = this;
        window.addEventListener('resize', function() {
            that.onResize();
        });

    }




    private calcColor(cLimLow:number, cLimHigh:number, actualValue:number): string {

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




    // overrides stub method in parent class
    public draw():Heatmap {

        this.drawSvgElem();
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

        return this;
    }




    private drawAxisHorizontal():Heatmap {
        // draw the horizontal axis

        let myOffsetMinutes = (new Date()).getTimezoneOffset();
        let theirOffsetMinutes = this.histogram.countData[0].dateFrom.utcOffset();
        let offsetMinutes:number = myOffsetMinutes + theirOffsetMinutes;

        this.dateScale = d3.time.scale()
            .domain([this.histogram.xDomainFrom.clone().add(offsetMinutes, 'minutes').toDate(),
                     this.histogram.xDomainTo.clone().add(offsetMinutes, 'minutes').toDate()])
            .range([0, this.domElem.clientWidth - this.paddingLeft - this.paddingRight]);


        // create an axis object for the date
        var dateAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dateScale)
            .ticks(5);

        // add the date axis group to the chart
        this.svg
            .append('g')
                .attr('class', 'dateAxisGroup')
                .attr('transform', 'translate(' + this.paddingLeft + ',' + (this.domElem.clientHeight - this.paddingBottom) + ')')
                .call(dateAxis);

        return this;

    }; // end method drawAxisHorizontal()




    private drawAxisVertical(): Heatmap {
        // draw the horizontal axis
        this.todScale = d3.scale.linear()
            .domain([this.histogram.yDomainFrom, this.histogram.yDomainTo])
            .range([0, this.domElem.clientHeight - this.paddingTop - this.paddingBottom]);

        // create an axis object for the time of day
        var todAxis = d3.svg.axis()
            .orient('left')
            .scale(this.todScale);

        // add the time of day axis group to the chart
        this.svg
            .append('g')
                .attr('class', 'todAxisGroup')
                .attr('transform', 'translate(' + this.paddingLeft + ',' + this.paddingTop + ')')
                .call(todAxis);

        return this;

    }; // end method drawAxisVertical()




    private drawBackground(): Heatmap {
        // draw background
        let elem = this.svg
            .append('g')
                .attr('class', 'chart');

        elem.attr('transform', 'translate(' + this.paddingLeft + ',' + this.paddingTop + ')');

        // set the width and height of the chart background
        elem.append('rect')
            .attr('width', this.domElem.clientWidth - this.paddingLeft - this.paddingRight)
            .attr('height', this.domElem.clientHeight - this.paddingTop - this.paddingBottom)
            .attr('class', 'background');

        return this;

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




    private drawButton(offsetX: number, offsetY: number, arrowDirection: string, s: string): Heatmap {

        // draw button
        var button,
            that;

        // select the chart elem, append an svg group, assign it 'button' class
        button = this.svg
            .append('g')
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

        return this;
    }




    private drawButtonLeftArrowLeft(): Heatmap {
        // draw button on the left of the heatmap with an arrow pointing left

        let offsetX: number;
        let offsetY: number;

        offsetX = this.paddingLeft - this.buttonWidth - 5;
        offsetY = this.paddingTop / 2 - this.buttonHeight / 2;

        this.drawButton(offsetX, offsetY, 'left', 'left, left');

        return this;
    }




    private drawButtonLeftArrowRight(): Heatmap {
        // draw button on the left of the timelin with an arrow pointing right

        let offsetX: number;
        let offsetY: number;

        offsetX = this.paddingLeft + 5;
        offsetY = this.paddingTop / 2 - this.buttonHeight / 2;

        this.drawButton(offsetX, offsetY, 'right', 'left, right');

        return this;
    }




    private drawButtonRightArrowLeft(): Heatmap {
        // draw button on the right of the heatmap with an arrow pointing left

        let offsetX: number;
        let offsetY: number;

        offsetX = this.domElem.clientWidth - this.paddingRight - this.buttonWidth - 5;
        offsetY = this.paddingTop / 2 - this.buttonHeight / 2;

        this.drawButton(offsetX, offsetY, 'left', 'right, left');

        return this;
    }




    private drawButtonRightArrowRight(): Heatmap {
        // draw button on the right of the heatmap with an arrow pointing right

        let offsetX: number;
        let offsetY: number;

        offsetX = this.domElem.clientWidth - this.paddingRight + 5;
        offsetY = this.paddingTop / 2 - this.buttonHeight / 2;

        this.drawButton(offsetX, offsetY, 'right', 'right, right');

        return this;
    }




    private drawHeatmap(): Heatmap {
        // draw heatmap based on this.histogram data

        // create the heatmap by adding colored rectangles to the chart
        var heatmap = this.svg
            .append('g').attr('class', 'heatmap');

        heatmap.attr('transform', 'translate(' + this.paddingLeft + ',' + this.paddingTop + ')');

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
            .attr('width', function () {return (that.domElem.clientWidth - that.paddingLeft - that.paddingRight) /
                    that.histogram.xDomainExtent; })
            .attr('height', function () {return (that.domElem.clientHeight - that.paddingTop - that.paddingBottom) /
                    that.histogram.yDomainExtent; })
            .attr('fill', function (d:any) {return that.calcColor(that.histogram.min, that.histogram.max, d.count); })
            .attr('fill-opacity', function (d:any) {return d.count ? 1.0 : 0.0; })
            .attr('class', 'histogram');

        // retieve the data associated with the element that the user clicked
        heatmap.selectAll('rect.histogram')
            .on('click', function (d:any) {console.log(d); });

        return this;


    } // end method drawHeatmap()




    private drawLegend(): Heatmap {
        // draw figure legend

        var that = this;

        let left:number = this.domElem.clientWidth - this.paddingRight + 20;
        let top:number = this.paddingTop + 0.3 * (this.domElem.clientHeight - this.paddingTop - this.paddingBottom);

        let legend = this.svg
            .append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (left) + ',' + top + ')');

        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 20)
            .attr('class', 'legend-min')
            .attr('fill', function (d:any) {
                    return that.calcColor(that.histogram.min, that.histogram.max, that.histogram.min);
                });

        legend.append('text')
            .attr('x', 30)
            .attr('y', 15)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'baseline')
            .attr('class', 'legend-min')
            .text('min: ' + this.histogram.min);

        legend.append('rect')
            .attr('x', 0)
            .attr('y', 30)
            .attr('width', 20)
            .attr('height', 20)
            .attr('class', 'legend-max')
            .attr('fill', function (d:any) {
                return that.calcColor(that.histogram.min, that.histogram.max, that.histogram.max);
            });

        legend.append('text')
            .attr('x', 30)
            .attr('y', 45)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'baseline')
            .attr('class', 'legend-max')
            .text('max: ' + this.histogram.max);

        return this;

    } // end method drawLegend()




    private drawSvgElem():Heatmap {

        this.svg = d3.select(this.domElem).append('svg');

        // append an svg element to the heatmap div
        this.svg
            .attr('class', 'svg')
            .attr('width', this.domElem.clientWidth)
            .attr('height', this.domElem.clientHeight);

        return this;

    } // end method appendSvgElem()




    private drawTitle():Heatmap {
        // draw figure title
        let left:number = this.paddingLeft + (this.domElem.clientWidth - this.paddingLeft - this.paddingRight) / 2;
        let top: number = this.paddingTop / 2;
        this.svg
            .append('g')
                .attr('class', 'title')
                    .attr('transform', 'translate(' + left  + ', ' + top + ')')
                    .append('text')
                    .text('Number of records: ' + this.histogram.numberOfRecords)
                    .attr('text-anchor', 'middle');

        return this;

    } // end method drawTitle()




    private drawXLabel():Heatmap {
        // draw figure xlabel
        let left:number = this.paddingLeft + (this.domElem.clientWidth - this.paddingLeft - this.paddingRight) / 2;
        let top:number = this.domElem.clientHeight - this.paddingBottom / 2;
        this.svg
            .append('g')
                .attr('class', 'xlabel')
                .attr('transform', 'translate(' + left  + ', ' + top + ')')
                .append('text')
                    .text('date')
                    .attr('text-anchor', 'middle');

        return this;
    } // end method drawXLabel()




    private drawYLabel(): Heatmap {
        // draw figure ylabel
        let left: number = this.paddingLeft / 2;
        let top:number = this.paddingTop + (this.domElem.clientHeight - this.paddingTop - this.paddingBottom) / 2;
        this.svg
            .append('g')
                .attr('class', 'ylabel')
                .attr('transform', 'translate(' + left + ', ' + top  + ') rotate(-90)')
                .append('text')
                    .text('time of day')
                    .attr('text-anchor', 'middle');

        return this;
    } // end method drawYLabel()





    private onResize() {

        // get the div element that we want to redraw
        let div = this.domElem;

        // delete the contents of the div
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        // draw the figure again, given that the window just changed size
        this.draw();
    }





    private updateMinHeight():Heatmap {

        let top:number = this.paddingTop;
        let bottom:number = this.paddingBottom;

        if (typeof top === 'undefined' || top < 0) {
            top = 0;
        }

        if (typeof bottom === 'undefined' || bottom < 0) {
            bottom = 0;
        }

        this.domElem.style.minHeight = (top + bottom + 100).toString() + 'px';

        return this;
    }




    private updateMinWidth():Heatmap {

        let left:number = this.paddingLeft;
        let right:number = this.paddingRight;

        if (typeof left === 'undefined' || left < 0) {
            left = 0;
        }

        if (typeof right === 'undefined' || right < 0) {
            right = 0;
        }

        this.domElem.style.minWidth = (left + right + 100).toString() + 'px';

        return this;
    }


    // getters and setters
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

    private get dateScale():d3.time.Scale<number, number> {
        return this._dateScale;
    }

    private set dateScale(dateScale:d3.time.Scale<number, number>) {
        this._dateScale = dateScale;
    }

    private get histogram():Histogram {
        return this._histogram;
    }

    private set histogram(histogram:Histogram) {
        this._histogram = histogram;
    }

    private get todScale():d3.scale.Linear<number, number> {
        return this._todScale;
    }

    private set todScale(todScale:d3.scale.Linear<number, number>) {
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

    private get domElemId():string {
        return this._domElemId;
    }

    private set domElemId(domElemId:string) {
        this._domElemId = domElemId;
    }

    private get domElem():HTMLElement {
        return this._domElem;
    }

    private set domElem(domElem:HTMLElement) {
        this._domElem = domElem;
    }

    private get paddingLeft():number {
        return this._paddingLeft;
    }

    private set paddingLeft(paddingLeft:number) {
        this._paddingLeft = paddingLeft;
        this.updateMinWidth();
    }

    private get paddingRight():number {
        return this._paddingRight;
    }

    private set paddingRight(paddingRight:number) {
        this._paddingRight = paddingRight;
        this.updateMinWidth();
    }

    private get paddingTop():number {
        return this._paddingTop;
    }

    private set paddingTop(paddingTop:number) {
        this._paddingTop = paddingTop;
        this.updateMinHeight();
    }

    private get paddingBottom():number {
        return this._paddingBottom;
    }

    private set paddingBottom(paddingBottom:number) {
        this._paddingBottom = paddingBottom;
        this.updateMinHeight();
    }

    private get svg():d3.Selection<any> {
        return this._svg;
    }

    private set svg(svg:d3.Selection<any>) {
        this._svg = svg;
    }


}


