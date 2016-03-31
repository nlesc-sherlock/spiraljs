/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="./punchcard-colormap.ts" />




type PunchcardVisualization = PunchcardBase|PunchcardDateCircle|PunchcardDateRect|
                                    PunchcardWeekdayCircle|PunchcardWeekdayRect;


class PunchcardLegend {

    private _marginLeft      : number;
    private _marginRight     : number;
    private _marginTop       : number;
    private _marginBottom    : number;
    private _sibling         : PunchcardVisualization;
    private _title           : string;
    private _ylabel          : string;
    private _horizontalScale : any;
    private _verticalScale   : any;
    private _width           : number;
    private _height          : number;


    constructor (sibling:PunchcardVisualization) {

        this.sibling = sibling;

        // the margins around the legend body
        this.marginLeft = 0;
        this.marginRight = 60;
        this.marginTop = this.sibling.marginTop;
        this.marginBottom = this.sibling.marginBottom;

        this.width = this.sibling.legendWidth - this.marginLeft - this.marginRight;
        this.height = this.sibling.domElem.clientHeight - this.marginTop - this.marginBottom;

        this.title = '';
        this.ylabel = '';

    }




    public draw(): PunchcardLegend {
        // draw the legend

        this.drawLegendBody();
        this.drawHorizontalAxis();
        this.drawVerticalAxis();
        this.drawVerticalAxisLabel();
        this.drawTitle();
        this.drawSymbols();
        this.drawBox();

        return this;
    }




    protected drawBox():PunchcardLegend {
        // draw box

        let dx:number = this.sibling.domElem.clientWidth - this.sibling.legendWidth + this.marginLeft;
        let dy:number = this.marginTop;

        this.sibling.svg.append('g')
            .attr('class', 'legend legendbody-box')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .append('rect')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'legend legendbody-box');

        return this;
    }




    private drawHorizontalAxis():PunchcardLegend {

        let dx:number = this.sibling.domElem.clientWidth - this.sibling.legendWidth + this.marginLeft;
        let dy:number = this.sibling.domElem.clientHeight - this.marginBottom;

        let horizontalAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.horizontalScale)
            .ticks(0);

        this.sibling.svg.append('g')
            .attr('class', 'legend horizontal-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' );

        return this;

    }




    protected drawLegendBody():PunchcardLegend {
        //
        let dx:number = this.sibling.domElem.clientWidth - this.sibling.legendWidth + this.marginLeft;
        let dy:number = this.sibling.domElem.clientHeight - this.marginBottom - this.height;


        this.sibling.svg.append('g')
            .attr('class', 'legend legendbody')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .append('rect')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'legend legendbody');

        return this;
    }




    protected drawSymbols():PunchcardLegend {
        // pass

        let that:PunchcardLegend = this;

        let dx:number = this.sibling.domElem.clientWidth - this.sibling.legendWidth + this.marginLeft;
        let dy:number = this.sibling.domElem.clientHeight - this.marginBottom;

        let data: any = [];
        let nRects:number = 128;
        for (let iRect = 0; iRect < nRects; iRect += 1) {
            data.push({
                    value: this.sibling.colormap.cLimLow +
                            ((iRect + 0.5) / nRects) * (this.sibling.colormap.cLimHigh - this.sibling.colormap.cLimLow)
                });
        }

        let symbolHeight: number = this.height / nRects;

        // draw the rects
        this.sibling.svg
            .append('g')
            .attr('class', 'legend symbol')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .selectAll('rect.symbol')
                .data(data)
                .enter()
                .append('rect')
                    .attr('class', 'symbol')
                    .attr('x', 0)
                    .attr('y', function(d){
                        return that.verticalScale(d.value) - 0.5 * symbolHeight;
                    })
                    .attr('width', this.width)
                    .attr('height', symbolHeight)
                    .attr('fill', function(d){
                        return that.sibling.colormap.getColorRGB(d.value);
                    });

        return this;
    }




    protected drawTitle():PunchcardLegend {

        let dx:number = this.sibling.domElem.clientWidth - this.sibling.legendWidth + this.marginLeft + 0.5 * this.width;
        let dy:number = this.marginTop - 20;

        this.sibling.svg.append('g')
            .attr('class', 'legend title')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .append('text')
            .text(this.title)
            .attr('class', 'title');

        return this;
    }




    protected drawVerticalAxis():PunchcardLegend {
        //
        let w :number = this.sibling.legendWidth - this.marginLeft - this.marginRight;
        let h :number = this.sibling.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.sibling.domElem.clientWidth - this.sibling.legendWidth + this.marginLeft + w;
        let dy:number = this.sibling.domElem.clientHeight - this.marginBottom;

        this.verticalScale = d3.scale.linear()
            .range([0, -h])
            .domain([this.sibling.colormap.cLimLow, this.sibling.colormap.cLimHigh]);

        let verticalAxis = d3.svg.axis()
            .orient('right')
            .scale(this.verticalScale)
            .innerTickSize(5)
            .outerTickSize(5);

        this.sibling.svg.append('g')
            .attr('class', 'legend vertical-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(verticalAxis);

        return this;

    }




    protected drawVerticalAxisLabel():PunchcardLegend {
        //
        let h :number = this.sibling.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.sibling.domElem.clientWidth - this.marginRight + 40;
        let dy:number = this.marginTop + 0.5 * h;

        this.sibling.svg.append('g')
            .attr('class', 'legend vertical-axis-label')
            .attr('transform', 'translate(' + dx + ',' + dy + ') rotate(-90)')
            .append('text')
            .text(this.ylabel)
            .attr('class', 'legend vertical-axis-label');

        return this;

    }




    protected set marginLeft(marginLeft:number) {
        this._marginLeft = Math.max(marginLeft, 0);
    }

    protected get marginLeft():number {
        return this._marginLeft;
    }

    protected set marginRight(marginRight:number) {
        this._marginRight = Math.max(marginRight, 0);
    }

    protected get marginRight():number {
        return this._marginRight;
    }

    protected set marginTop(marginTop:number) {
        this._marginTop = Math.max(marginTop, this.sibling.marginTop);
    }

    protected get marginTop():number {
        return this._marginTop;
    }

    protected set marginBottom(marginBottom:number) {
        this._marginBottom = Math.max(marginBottom, this.sibling.marginBottom);
    }

    protected get marginBottom():number {
        return this._marginBottom;
    }

    protected set title(title:string) {
        this._title = title;
    }

    protected get title():string {
        return this._title;
    }

    protected set ylabel(ylabel:string) {
        this._ylabel = ylabel;
    }

    protected get ylabel():string {
        return this._ylabel;
    }

    protected set sibling(sibling:PunchcardVisualization) {
        this._sibling = sibling;
    }

    protected get sibling():PunchcardVisualization {
        return this._sibling;
    }

    protected set horizontalScale(horizontalScale:any) {
        this._horizontalScale = horizontalScale;
    }

    protected get horizontalScale():any {
        return this._horizontalScale;
    }

    protected set verticalScale(verticalScale:any) {
        this._verticalScale = verticalScale;
    }

    protected get verticalScale():any {
        return this._verticalScale;
    }

    protected set width(width:number) {
        this._width = width;
    }

    protected get width():number {
        return this._width;
    }

    protected set height(height:number) {
        this._height = height;
    }

    protected get height():number {
        return this._height;
    }

}

