/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />



class Punchcard {

    private _cf       : CrossFilter.CrossFilter<IDataRow>;
    private _dim      : any;
    private _domElem  : HTMLElement;
    private _domElemId: string;




    constructor (cf: any, domElemId: string) {

        this.cf = cf;

        this.domElemId = domElemId;

        this.domElem = document.getElementById(this.domElemId);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        this.dim = {};

    }




    public defineDimensions() {
        this.dim.date = this.cf.dimension(function(d:IDataRow){
            return d.momentStartOfDay;
        });
        this.dim.timeOfDay = this.cf.dimension(function(d:IDataRow){
            return d.timeOfDay;
        });
    }




    public draw() {

        let minDate: moment.Moment;
        let maxDate: moment.Moment;

        minDate = this.dim.date.bottom(1)[0].momentStartOfDay;
        maxDate = this.dim.date.top(1)[0].momentStartOfDay;

        let measure = this.dim.date.group().reduceCount();

        dc.bubbleChart('#' + this.domElemId)
            .width(990)
            .height(500)
            .margins({top: 10, right: 50, bottom: 30, left: 60})
            .dimension(this.dim.date)
            .group(measure)
            .x(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()]))
            .y(d3.scale.linear().domain([0, 24]))
            .r(d3.scale.linear().domain([0, 1000]))
            .maxBubbleRelativeSize(0.1)
            .elasticX(true)
            .elasticY(true)
            .elasticRadius(true)
            .yAxisLabel('Total number of arrests')
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true);
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


}

