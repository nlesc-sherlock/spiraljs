/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />



class OneDimensionalHistogram {

    private _cf: CrossFilter.CrossFilter<IDataRow>;
    private _dim: any;
    private _domElemId: string;
    private _domElem: HTMLElement;
    private margins:any;

    constructor (cf: any, domElemId:string) {

        this.cf = cf;

        this.domElemId = domElemId;

        this.domElem = document.getElementById(this.domElemId);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        this.dim = {};

        this.margins = {top: 80, right: 80, bottom: 80, left: 80};

    }




    public defineDimensions() {

        // define a dimension 'dateFrom', that contains the start of the day on which an
        // arrest occurred:
        this.dim.dateFrom = this.cf.dimension(function (d:IDataRow) {
            return new Date(d.datestr.slice(0, 10));
        });
    }




    public draw() {

        // select the earliest datestr in the crossfilter data, get the
        // .datestr property of that one fact, then turn it into a moment.js
        // object to be able to ask for the datestr corresponding to the start
        // of the first day
        let minDate = moment(this.dim.dateFrom.bottom(1)[0].datestr)
            .startOf('day');
        // do the same for the last datestr in the set
        let maxDate = moment(this.dim.dateFrom.top(1)[0].datestr)
            .endOf('day');

        let dailyCountBarChart = dc.barChart('#' + this.domElemId);

        let dailyCountMeasure = this.dim.dateFrom.group().reduceCount();

        dailyCountBarChart
            .dimension(this.dim.dateFrom)
            .group(dailyCountMeasure)
            .width(this.domElem.clientWidth)
            .height(this.domElem.clientHeight)
            .margins(this.margins)
            .centerBar(false)
            .elasticX(false)
            .elasticY(true)
            .gap(0)
            .x(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()]))
            .xAxisLabel('Date')
            .yAxisLabel('Total number of arrests')
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true);

        dailyCountBarChart.xUnits(function(){
            return maxDate.diff(minDate, 'days', true);
        });

        dc.renderAll();

    }


    private set cf(cf:any) {
        this._cf = cf;
    }

    private get cf() {
        return this._cf;
    }

    public set dim(dim:any){
        this._dim = dim;
    }

    public get dim(){
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

}



