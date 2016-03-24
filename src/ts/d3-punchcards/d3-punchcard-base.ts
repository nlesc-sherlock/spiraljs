/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />



class D3PunchcardBase {

    private _cf          : CrossFilter.CrossFilter<IDataRow>;
    private _colormap    : ColorMap;
    private _dim         : any;
    private _domElem     : HTMLElement;
    private _domElemId   : string;
    private _svg         : any;
    private _marginLeft  : number;
    private _marginRight : number;
    private _marginTop   : number;
    private _marginBottom: number;
    private _title       : string;
    private _xlabel      : string;
    private _ylabel      : string;
    private _todScale    : any;



    constructor (cf: any, domElemId: string) {


        // the crossfilter object
        this.cf = cf;

        // the name of the DOM element
        this.domElemId = domElemId;

        // the DOM element by ID
        this.domElem = document.getElementById(this.domElemId);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        this.dim = {};

        // the margins around the graph body
        this.marginLeft = 120;
        this.marginRight = 80;
        this.marginTop = 60;
        this.marginBottom = 100;

        this.ylabel = 'Local time of day';
        this.title = '';

        this.colormap = new ColorMap();

        // beware: JavaScript magic happens here
        let that:D3PunchcardBase = this;
        window.addEventListener('resize', function() {
            that.onResize();
        });



    }




    public draw():D3PunchcardBase {

        // placeholder method to be overridden in classes that inherit from this class
        return this;
    }




    protected drawSvg():D3PunchcardBase {

        this.updateMinHeight();
        this.updateMinWidth();

        this.svg = d3.select(this.domElem).append('svg')
            .attr('width', this.domElem.clientWidth)
            .attr('height', this.domElem.clientHeight);

        return this;
    }




    protected drawChartBody():D3PunchcardBase {
        //
        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop;


        this.svg.append('g')
            .attr('class', 'chartbody')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .append('rect')
                .attr('width', w)
                .attr('height', h)
                .attr('class', 'chartbody');

        return this;
    }




    protected drawHorizontalAxisLabel():D3PunchcardBase {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft + 0.5 * w;
        let dy:number = this.marginTop + h + 0.5 * this.marginBottom;

        this.svg.append('g')
            .attr('class', 'horizontal-axis-label')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .append('text')
            .text(this.xlabel)
            .attr('class', 'horizontal-axis-label');

        return this;
    }



    protected drawVerticalAxis():D3PunchcardBase {
        //
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;


        this.todScale = d3.scale.linear()
            .range([-h, 0])
            .domain([0.0, 24.0]);

        let todAxis = d3.svg.axis()
            .orient('left')
            .scale(this.todScale);

        this.svg.append('g')
            .attr('class', 'vertical-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(todAxis);

        return this;

    }




    protected drawVerticalAxisLabel():D3PunchcardBase {
        //
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = 0.5 * this.marginLeft;
        let dy:number = this.marginTop + 0.5 * h;

        this.svg.append('g')
            .attr('class', 'vertical-axis-label')
            .attr('transform', 'translate(' + dx + ',' + dy + ') rotate(-90)')
            .append('text')
            .text(this.ylabel)
            .attr('class', 'vertical-axis-label');

        return this;

    }




    protected drawTitle():D3PunchcardBase {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let dx:number = this.marginLeft + 0.5 * w;
        let dy:number = 0.5 * this.marginTop;

        this.svg.append('g')
            .attr('class', 'title')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .append('text')
            .text(this.title)
            .attr('class', 'title');

        return this;
    }




    protected onResize() {

        // get the div element that we want to redraw
        let div = this.domElem;

        // delete the contents of the div
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        // draw the figure again, given that the window just changed size
        this.draw();
    }




    private updateMinHeight():D3PunchcardBase {

        let top:number = this.marginTop;
        let bottom:number = this.marginBottom;

        if (typeof top === 'undefined' || top < 0) {
            top = 0;
        }

        if (typeof bottom === 'undefined' || bottom < 0) {
            bottom = 0;
        }

        this.domElem.style.minHeight = (top + bottom + 100).toString() + 'px';

        return this;
    }




    private updateMinWidth():D3PunchcardBase {

        let left:number = this.marginLeft;
        let right:number = this.marginRight;

        if (typeof left === 'undefined' || left < 0) {
            left = 0;
        }

        if (typeof right === 'undefined' || right < 0) {
            right = 0;
        }

        this.domElem.style.minWidth = (left + right + 100).toString() + 'px';

        return this;
    }




    protected set cf(cf:any) {
        this._cf = cf;
    }

    protected get cf():any {
        return this._cf;
    }

    protected set colormap(colormap:ColorMap) {
        this._colormap = colormap;
    }

    protected get colormap():ColorMap {
        return this._colormap;
    }

    protected set dim(dim:any) {
        this._dim = dim;
    }

    protected get dim():any {
        return this._dim;
    }

    protected set domElem(domElem:HTMLElement) {
        this._domElem = domElem;
    }

    protected get domElem():HTMLElement {
        return this._domElem;
    }

    protected set domElemId(domElemId:string) {
        this._domElemId = domElemId;
    }

    protected get domElemId():string {
        return this._domElemId;
    }

    protected set svg(svg:any) {
        this._svg = svg;
    }

    protected get svg():any {
        return this._svg;
    }

    protected set marginLeft(marginLeft:number) {
        this._marginLeft = marginLeft;
        this.updateMinWidth();
    }

    protected get marginLeft():number {
        return this._marginLeft;
    }

    protected set marginRight(marginRight:number) {
        this._marginRight = marginRight;
        this.updateMinWidth();
    }

    protected get marginRight():number {
        return this._marginRight;
    }

    protected set marginTop(marginTop:number) {
        this._marginTop = marginTop;
        this.updateMinHeight();
    }

    protected get marginTop():number {
        return this._marginTop;
    }

    protected set marginBottom(marginBottom:number) {
        this._marginBottom = marginBottom;
        this.updateMinHeight();
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

    protected set xlabel(xlabel:string) {
        this._xlabel = xlabel;
    }

    protected get xlabel():string {
        return this._xlabel;
    }

    protected set ylabel(ylabel:string) {
        this._ylabel = ylabel;
    }

    protected get ylabel():string {
        return this._ylabel;
    }

    protected set todScale(todScale:any) {
        this._todScale = todScale;
    }

    protected get todScale():any {
        return this._todScale;
    }


}


