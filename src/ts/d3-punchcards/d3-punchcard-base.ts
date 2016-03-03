/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />



class D3PunchcardBase {

    private _cf          : CrossFilter.CrossFilter<IDataRow>;
    private _dim         : any;
    private _domElem     : HTMLElement;
    private _domElemId   : string;
    private _svg         : any;
    private _marginLeft  : number;
    private _marginRight : number;
    private _marginTop   : number;
    private _marginBottom: number;
    private _title       : string;
    private _ylabel      : string;
    private _todScale    : any;



    constructor (cf: any, domElemId: string) {

        this.cf = cf;

        this.domElemId = domElemId;

        this.domElem = document.getElementById(this.domElemId);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        this.dim = {};

        this.marginLeft = 120;
        this.marginRight = 80;
        this.marginTop = 60;
        this.marginBottom = 100;

        this.ylabel = 'Local time of day';
        this.title = '';

        // beware: JavaScript magic happens here
        let that:D3PunchcardBase = this;
        window.onresize = function(){that.onResize(); };

    }




    public defineDimensions():D3PunchcardBase {

        this.dim.byHour = this.cf.dimension(function(d:IDataRow):moment.Moment{
            let r = d.momentStartOfDay.clone().add(d.timeOfDay, 'hour');
            return r;
        });

        return this;
    }




    public draw():D3PunchcardBase {
    //     //
    //     this.drawSvg();
    //     this.drawChartBody();
    //     this.drawHorizontalAxis();
    //     this.drawHorizontalAxisLabel();
    //     this.drawVerticalAxis();
    //     this.drawVerticalAxisLabel();
    //     this.drawTitle();
    //     this.drawSymbols();
    //

        // placeholder method to be overridden in classes that inherit from this class
        return this;
    }




    protected drawSvg():D3PunchcardBase {

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




    public onResize() {

        // get the div element that we want to redraw
        let div = this.domElem;

        // delete the contents of the div
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        // draw the figure again, given that the window just changed size
        this.draw();
    }




    private set cf(cf:any) {
        this._cf = cf;
    }

    private get cf():any {
        return this._cf;
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

    private set domElemId(domElemId:string) {
        this._domElemId = domElemId;
    }

    private get domElemId():string {
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
    }

    protected get marginLeft():number {
        return this._marginLeft;
    }

    protected set marginRight(marginRight:number) {
        this._marginRight = marginRight;
    }

    protected get marginRight():number {
        return this._marginRight;
    }

    protected set marginTop(marginTop:number) {
        this._marginTop = marginTop;
    }

    protected get marginTop():number {
        return this._marginTop;
    }

    protected set marginBottom(marginBottom:number) {
        this._marginBottom = marginBottom;
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

    protected set todScale(todScale:any) {
        this._todScale = todScale;
    }

    protected get todScale():any {
        return this._todScale;
    }


}


