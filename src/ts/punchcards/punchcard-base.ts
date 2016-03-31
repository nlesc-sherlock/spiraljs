/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="./punchcard-colormap.ts" />


class PunchcardBase {

    private _cf          : CrossFilter.CrossFilter<IDataRow>;
    private _colormap    : PunchcardColorMap;
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
    private _height      : number;
    private _legendWidth : number;



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
        this.marginLeft = 70;
        this.marginRight = 30;
        this.marginTop = 50;
        this.marginBottom = 110;
        this.legendWidth = 80;

        this.ylabel = 'Time of day';
        this.title = '';

        this.colormap = new PunchcardColorMap();

        // beware: JavaScript magic happens here
        let that:PunchcardBase = this;
        window.addEventListener('resize', function() {
            that.onResize();
        });
    }




    public draw():PunchcardBase {

        // placeholder method to be overridden in classes that inherit from this class
        return this;
    }




    protected drawBox():PunchcardBase {
        //
        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop;


        this.svg.append('g')
            .attr('class', 'chartbody-box')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .append('rect')
                .attr('width', w)
                .attr('height', h)
                .attr('class', 'chartbody-box');

        return this;
    }




    protected drawControls():void {

        let controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';

        controlsDiv.innerHTML =
            '<button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Minimizes the widget">' +
            '    <span class="glyphicon glyphicon-triangle-bottom"></span>' +
            '</button>' +
            '<button type="button" class="btn btn-default btn-sm hidden" data-toggle="tooltip" title="Restores the widget">' +
            '    <span class="glyphicon glyphicon-triangle-top"></span>' +
            '</button>' +
            '<button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Moves the widget up">' +
            '    <span class="glyphicon glyphicon-arrow-up"></span>' +
            '</button>' +
            '<button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Moves the widget down">' +
            '    <span class="glyphicon glyphicon-arrow-down"></span>' +
            '</button>' +
            '<button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Closes the widget">' +
            '    <span class="glyphicon glyphicon-remove"></span>' +
            '</button>';

        this.domElem.appendChild(controlsDiv);

        // beware: JavaScript magic happens here
        let that:PunchcardBase = this;

        controlsDiv.getElementsByClassName('glyphicon-triangle-bottom')[0].parentNode.addEventListener('click', function() {
            that.minimize();
        });

        controlsDiv.getElementsByClassName('glyphicon-triangle-top')[0].parentNode.addEventListener('click', function() {
            that.restore();
        });

        controlsDiv.getElementsByClassName('glyphicon-arrow-up')[0].parentNode.addEventListener('click', function() {
            that.moveUp();
        });

        controlsDiv.getElementsByClassName('glyphicon-arrow-down')[0].parentNode.addEventListener('click', function() {
            that.moveDown();
        });

        controlsDiv.getElementsByClassName('glyphicon-remove')[0].parentNode.addEventListener('click', function() {
            that.hide();
        });


    }




    protected drawChartBody():PunchcardBase {
        //
        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
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




    protected drawHorizontalAxisLabel():PunchcardBase {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft + 0.5 * w;
        let dy:number = this.marginTop + h + 0.8 * this.marginBottom;

        this.svg.append('g')
            .attr('class', 'horizontal-axis-label')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .append('text')
            .text(this.xlabel)
            .attr('class', 'horizontal-axis-label');

        return this;
    }




    protected drawLegend():PunchcardBase {
        // draw the legend

        let legend:PunchcardLegend = new PunchcardLegend(this);
        legend.draw();


        return this;
    }


    protected drawSvg():PunchcardBase {

        this.svg = d3.select(this.domElem).append('svg')
            .attr('width', this.domElem.clientWidth)
            .attr('height', this.domElem.clientHeight);

        return this;
    }




    protected drawTitle():PunchcardBase {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
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




    protected drawVerticalAxis():PunchcardBase {
        //
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;


        this.todScale = d3.scale.linear()
            .range([-h, 0])
            .domain([0.0, 24.0]);

        let todAxis = d3.svg.axis()
            .orient('left')
            .scale(this.todScale)
            .tickValues([0, 3, 6, 9, 12, 15, 18, 21, 24])
            .innerTickSize(5)
            .outerTickSize(0);

        this.svg.append('g')
            .attr('class', 'vertical-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(todAxis);

        return this;

    }




    protected drawVerticalAxisLabel():PunchcardBase {
        //
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = 0.3 * this.marginLeft;
        let dy:number = this.marginTop + 0.5 * h;

        this.svg.append('g')
            .attr('class', 'vertical-axis-label')
            .attr('transform', 'translate(' + dx + ',' + dy + ') rotate(-90)')
            .append('text')
            .text(this.ylabel)
            .attr('class', 'vertical-axis-label');

        return this;

    }




    protected hide():PunchcardBase {

        this.domElem.classList.add('hidden');
        return this;
    }




    protected minimize():void {

        // hide the contents of the div:
        this.domElem.getElementsByTagName('svg')[0].classList.add('hidden');

        // store the current height:
        this.height = this.domElem.clientHeight;

        // resize the div
        this.domElem.style.minHeight = '40px';
        this.domElem.style.height = '40px';

        // cast the event target to an HTMLElement so as not to confuse TypeScript
        let minimButton: HTMLElement;
        let myTarget: HTMLElement = <HTMLElement>event.target;
        if (myTarget.tagName === 'BUTTON') {
            // user clicked on the button part
            minimButton = <HTMLElement>event.target;
        } else if (myTarget.tagName === 'SPAN') {
            // user clicked glyph part of the button
            minimButton = <HTMLElement>myTarget.parentNode;
        } else {
            // pass
        }

        // hide the minimize button
        minimButton.classList.add('hidden');

        let restoreButton: HTMLElement = <HTMLElement>minimButton.nextSibling;

        // show the restore button
        restoreButton.classList.remove('hidden');

        // Not sure this even works
        event.stopPropagation();

    }



    protected moveDown():void {

        let myElem = this.domElem;
        let otherElem = this.domElem.nextElementSibling;

        if (otherElem.tagName === 'DIV') {
            myElem.parentNode.insertBefore(otherElem, myElem);
        } else {
            console.error('You\'re already the last element.');
        }

        // Not sure this even works
        event.stopPropagation();

    }




    protected moveUp():void {

        let myElem = this.domElem;
        let otherElem = this.domElem.previousElementSibling;

        if (otherElem.tagName === 'DIV') {
            myElem.parentNode.insertBefore(myElem, otherElem);
        } else {
            console.error('You\'re already the first element.');
        }

        // Not sure this even works
        event.stopPropagation();

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




    protected restore():void {

        // cast the event target to an HTMLElement so as not to confuse TypeScript
        let restoreButton: HTMLElement;
        let myTarget: HTMLElement = <HTMLElement>event.target;
        if (myTarget.tagName === 'BUTTON') {
            // user clicked on the button part
            restoreButton = <HTMLElement>event.target;
        } else if (myTarget.tagName === 'SPAN') {
            // user clicked glyph part of the button
            restoreButton = <HTMLElement>myTarget.parentNode;
        } else {
            // pass
        }

        // hide the restore button
        restoreButton.classList.add('hidden');

        let minimButton: HTMLElement = <HTMLElement>restoreButton.previousSibling;

        // show the minimize button
        minimButton.classList.remove('hidden');

        // restore the original height
        this.domElem.style.height = this.height + 'px';

        // show the contents of the div
        this.domElem.getElementsByTagName('svg')[0].classList.remove('hidden');

        // Not sure this even works
        event.stopPropagation();

    }




    private updateMinHeight():PunchcardBase {

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




    private updateMinWidth():PunchcardBase {

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

    public set colormap(colormap:PunchcardColorMap) {
        this._colormap = colormap;
    }

    public get colormap():PunchcardColorMap {
        return this._colormap;
    }

    protected set dim(dim:any) {
        this._dim = dim;
    }

    protected get dim():any {
        return this._dim;
    }

    public set domElem(domElem:HTMLElement) {
        this._domElem = domElem;
    }

    public get domElem():HTMLElement {
        return this._domElem;
    }

    protected set domElemId(domElemId:string) {
        this._domElemId = domElemId;
    }

    protected get domElemId():string {
        return this._domElemId;
    }

    public set svg(svg:any) {
        this._svg = svg;
    }

    public get svg():any {
        return this._svg;
    }

    public set marginLeft(marginLeft:number) {
        this._marginLeft = marginLeft;
        this.updateMinWidth();
    }

    public get marginLeft():number {
        return this._marginLeft;
    }

    public set marginRight(marginRight:number) {
        this._marginRight = marginRight;
        this.updateMinWidth();
    }

    public get marginRight():number {
        return this._marginRight;
    }

    public set marginTop(marginTop:number) {
        this._marginTop = marginTop;
        this.updateMinHeight();
    }

    public get marginTop():number {
        return this._marginTop;
    }

    public set marginBottom(marginBottom:number) {
        this._marginBottom = marginBottom;
        this.updateMinHeight();
    }

    public get marginBottom():number {
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

    protected set height(height:number) {
        this._height = height;
    }

    protected get height():number {
        return this._height;
    }

    public set legendWidth(legendWidth:number) {
        let minimumWidth:number = 50;
        this._legendWidth = Math.max(legendWidth, 50);
    }

    public get legendWidth():number {
        return this._legendWidth;
    }

}


