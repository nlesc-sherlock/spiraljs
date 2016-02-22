/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />



class OneDimensionalHistogram {

    private _cf: any;
    private _dim: any;
    private _domElemId: string;
    private _domElem: HTMLElement;

    constructor (cf: any, domElemId:string) {
        // constructor function
        this._cf = cf;
        this._domElemId = domElemId;
        this._domElem = document.getElementById(this._domElemId);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:

        this._dim = {};

        // define a dimension 'date':
        this._dim.date = this._cf.dimension(function(fact:any){
            return moment(fact.datestr);
        });

        // define a dimension 'dateFrom', that contains the start of the day on which an
        // arrest occurred:
        this._dim.dateFrom = this._cf.dimension(function(fact:any){
            return moment(fact.datestr).startOf('day');
        });

        // define a dimension 'timeOfDay':
        this._dim.timeOfDay = this._cf.dimension(function(fact:any){
                // returns the float number of hours that passed since the
                // beginning of the day

                let m:any;
                let milliSecondsPerHour:number;

                m = moment(new Date(fact.datestr));
                milliSecondsPerHour = 3600 * 1000;

                return (m - m.clone().startOf('day')) / milliSecondsPerHour;

            });

        // Define a dimension 'primary'; which is a nominal scale variable, but
        // can still be useful for selecting a given type of crime quickly
        this._dim.primary = this._cf.dimension(function(fact:any){
            return fact.primary;
        });




    }

    public draw() {

        // select the earliest datetime in the crossfilter data, get the
        // .datestr property of that one fact, then turn it into a moment.js
        // object to be able to ask for the datetime corresponding to the start
        // of the first day
        var minDate = moment(this.dim.date.bottom(1)[0].datestr).startOf('day');
        // do the same for the last datetime in the set
        var maxDate = moment(this.dim.date.top(1)[0].datestr).endOf('day');

        var dailyCountBarChart = dc.barChart('#' + this._domElemId);

        var dailyCountMeasure = this.dim.dateFrom.group().reduceCount();

        dailyCountBarChart
            .dimension(this.dim.dateFrom)
            .group(dailyCountMeasure)
            .width(this.domElem.clientWidth)
            .height(this.domElem.clientHeight)
            .elasticY(true)
            .x(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()]))
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


    public get dim(){
        return this._dim;
    }


    private set domElem(domElem:HTMLElement) {
        this._domElem = domElem;
    }

    private get domElem() {
        return this._domElem;
    }


}