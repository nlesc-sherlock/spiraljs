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

        // define a dimension 'date':
        this.dim.date = this.cf.dimension(function(fact:IDataRow){
            return fact.moment;
        });

        // define a dimension 'dateFrom', that contains the start of the day on which an
        // arrest occurred:
        this.dim.dateFrom = this.cf.dimension(function(fact:IDataRow){
            return fact.momentStartOfDay;
        });

        // define a dimension 'timeOfDay':
        this.dim.timeOfDay = this.cf.dimension(function(fact:IDataRow){
                // returns the float number of hours that passed since the
                // beginning of the day
                return fact.timeOfDay;
        });

        // Define a dimension 'primary'; which is a nominal scale variable, but
        // can still be useful for selecting a given type of crime quickly
        this.dim.primary = this.cf.dimension(function(fact:any){
            return fact.primary;
        });

    }




    public draw() {

        // select the earliest datetime in the crossfilter data, get the
        // .datestr property of that one fact, then turn it into a moment.js
        // object to be able to ask for the datetime corresponding to the start
        // of the first day
        let minDate = this.dim.date.bottom(1)[0].moment
            .clone()
            .startOf('day')
            .utc();
        // do the same for the last datetime in the set
        let maxDate = this.dim.date.top(1)[0].moment
            .clone()
            .endOf('day')
            .utc();

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
            .gap(5)
            .x(d3.time.scale.utc().domain([minDate, maxDate]))
            .xAxisLabel('Date UTC')
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



