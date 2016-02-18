/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />


class OneDimensionalHistogram {

    private _data: any;
    private _domElemId: string;
    private _domElem: HTMLElement;

    constructor (domElemId:string) {
        // constructor function
        this._domElemId = domElemId;
        this._domElem = document.getElementById(this._domElemId);
    }

    public draw() {


        var records = this._data;

        // Now we need to fill the crossfilter with data. Normally, I'd use a
        // two-step process, to first create the object, and then .add() the
        // data, like so:
        //
        // construct a new crossfilter facts with the data
        // var facts = crossfilter();
        //
        // add the arrests data to the crossfilter object:
        // facts.add(records);
        //
        // However, that doesn't work (a bug in crossfilter or its typings?) so
        // we do it in one command:

        let facts = crossfilter(records);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        let dim:any = {};

        // define a dimension 'date':
        dim.date = facts.dimension(function(fact:any){
            return moment(fact.datestr);
        });

        // define a dimension 'dateFrom', that contains the start of the day on which an
        // arrest occurred:
        dim.dateFrom = facts.dimension(function(fact:any){
            return moment(fact.datestr).startOf('day');
        });

        // define a dimension 'timeOfDay':
        dim.timeOfDay = facts.dimension(function(fact:any){
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
        dim.primary = facts.dimension(function(fact:any){
            return fact.primary;
        });

        // select the earliest datetime in the crossfilter data, get the
        // .datestr property of that one fact, then turn it into a moment.js
        // object to be able to ask for the datetime corresponding to the start
        // of the first day
        var minDate = moment(dim.date.bottom(1)[0].datestr).startOf('day');
        // do the same for the last datetime in the set
        var maxDate = moment(dim.date.top(1)[0].datestr).endOf('day');

        var dailyCountBarChart = dc.barChart('#' + this._domElemId);

        var dailyCountMeasure = dim.dateFrom.group().reduceCount();

        dailyCountBarChart
            .dimension(dim.dateFrom)
            .group(dailyCountMeasure)
            .width(this._domElem.clientWidth)
            .height(this._domElem.clientHeight)
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


    public set data(data:any) {
        this._data = data;
    }


}