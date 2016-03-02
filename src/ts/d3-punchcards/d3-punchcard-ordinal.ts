/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
// /// <reference path="../../typings/moment/moment.d.ts" />



class D3PunchcardOrdinal {

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
    private _xlabel      : string;
    private _ylabel      : string;
    private _dateScale   : any;
    private _todScale    : any;
    private _dateFrom    : Date;
    private _dateTo      : Date;



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
        this.xlabel = 'Date (UTC)';
        this.ylabel = 'Local time of day';
        this.title = '';

        this.svg = d3.select(this.domElem).append('svg')
            .attr('width', this.domElem.clientWidth)
            .attr('height', this.domElem.clientHeight);

    }




    public defineDimensions():D3PunchcardOrdinal {

        this.dim.byHour = this.cf.dimension(function(d:IDataRow):moment.Moment{
            let r = d.momentStartOfDay.clone().add(d.timeOfDay, 'hour');
            return r;
        });

        return this;
    }




    public draw():D3PunchcardOrdinal {
        //
        this.drawChartBody();
        this.drawHorizontalAxis();
        this.drawHorizontalAxisLabel();
        this.drawVerticalAxis();
        this.drawVerticalAxisLabel();
        this.drawTitle();
        this.drawSymbols();

        return this;
    }




    private drawChartBody():D3PunchcardOrdinal {
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




    private drawHorizontalAxis():D3PunchcardOrdinal {
        //

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;

        this.dateFrom = this.dim.byHour
            .bottom(1)[0]
            .moment
            .clone()
            .startOf('day')
            .utc();

        this.dateTo = this.dim.byHour
            .top(1)[0]
            .moment
            .clone()
            .endOf('day')
            .utc();

        this.dateScale = d3.time.scale.utc()
            .range([0, w])
            .domain([this.dateFrom, this.dateTo]);

        let dateAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dateScale)
            .ticks(7);

        this.svg.append('g')
            .attr('class', 'horizontal-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(dateAxis);

        return this;

    }




    private drawVerticalAxis():D3PunchcardOrdinal {
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




    private drawHorizontalAxisLabel():D3PunchcardOrdinal {
        //
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




    private drawVerticalAxisLabel():D3PunchcardOrdinal {
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




    private drawTitle():D3PunchcardOrdinal {
        //
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




    private drawSymbols():D3PunchcardOrdinal {

        // capture the this object
        let that:D3PunchcardOrdinal = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = 1.0; // pixels
        let symbolWidth :number = this.dateScale(moment(this.dateFrom).add(1, 'day').toDate()) - symbolMargin;
        let symbolHeight:number = -1 * this.todScale(23.0) - symbolMargin;
        let theData:any = this.dim.byHour.group().order(d3.ascending).reduceCount().top(Infinity);


        this.svg
            .append('g')
            .attr('class', 'symbol')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .selectAll('rect.symbol')
                .data(theData)
                .enter()
                .append('rect')
                    .attr('class', 'symbol')
                    .attr('x', function(d){
                        return that.dateScale(d.key.clone().startOf('day').utc());
                    })
                    .attr('y', function(d){
                        let m1 = d.key.clone().startOf('day');
                        let m2 = d.key.clone();
                        return that.todScale(m2.diff(m1, 'hour', false));
                    })
                    .attr('width', symbolWidth)
                    .attr('height', symbolHeight)
                    .attr('fill', function(d){
                        if (d.value > 50) {
                            return '#F00';
                        } else {
                            return '#080';
                        }
                    });


        return this;

    }




    private set cf(cf:any) {
        this._cf = cf;
    }

    private get cf():any {
        return this._cf;
    }

    private set dim(dim:any) {
        this._dim = dim;
    }

    private get dim():any {
        return this._dim;
    }

    private set domElem(domElem:HTMLElement) {
        this._domElem = domElem;
    }

    private get domElem():HTMLElement {
        return this._domElem;
    }

    private set domElemId(domElemId:string) {
        this._domElemId = domElemId;
    }

    private get domElemId():string {
        return this._domElemId;
    }

    private set svg(svg:any) {
        this._svg = svg;
    }

    private get svg():any {
        return this._svg;
    }

    private set marginLeft(marginLeft:number) {
        this._marginLeft = marginLeft;
    }

    private get marginLeft():number {
        return this._marginLeft;
    }

    private set marginRight(marginRight:number) {
        this._marginRight = marginRight;
    }

    private get marginRight():number {
        return this._marginRight;
    }

    private set marginTop(marginTop:number) {
        this._marginTop = marginTop;
    }

    private get marginTop():number {
        return this._marginTop;
    }

    private set marginBottom(marginBottom:number) {
        this._marginBottom = marginBottom;
    }

    private get marginBottom():number {
        return this._marginBottom;
    }

    private set title(title:string) {
        this._title = title;
    }

    private get title():string {
        return this._title;
    }

    private set xlabel(xlabel:string) {
        this._xlabel = xlabel;
    }

    private get xlabel():string {
        return this._xlabel;
    }

    private set ylabel(ylabel:string) {
        this._ylabel = ylabel;
    }

    private get ylabel():string {
        return this._ylabel;
    }

    private set dateScale(dateScale:any) {
        this._dateScale = dateScale;
    }

    private get dateScale():any {
        return this._dateScale;
    }

    private set todScale(todScale:any) {
        this._todScale = todScale;
    }

    private get todScale():any {
        return this._todScale;
    }

    private set dateFrom(dateFrom:Date) {
        this._dateFrom = dateFrom;
    }

    private get dateFrom():Date {
        return this._dateFrom;
    }

    private set dateTo(dateTo:Date) {
        this._dateTo = dateTo;
    }

    private get dateTo():Date {
        return this._dateTo;
    }



}


