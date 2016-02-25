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
        this.dim.date = this.cf.dimension(function(d:IDataRow):moment.Moment{
            return d.momentStartOfDay;
        });
        this.dim.timeOfDay = this.cf.dimension(function(d:IDataRow):number{
            return d.timeOfDay;
        });
    }




    public draw() {

        let minDate: moment.Moment;
        let maxDate: moment.Moment;

        minDate = this.dim.date.bottom(1)[0].momentStartOfDay;
        maxDate = this.dim.date.top(1)[0].momentStartOfDay;

        // FIXME the group-by reduce functions don't work
        let byTimeOfDay = this.dim.date.group().reduce(
            // increase
            function(p, v) {
                return 0;
            },
            function(p, v) {
            // decrease
                return 0;
            },
            // init
            function(p, v) {
                return 0;
            }
        );

        // FIXME the keyAccessor and valueAccessor don't work
        dc.bubbleChart('#' + this.domElemId)
            .width(this.domElem.clientWidth)
            .height(this.domElem.clientHeight)
            .margins({top: 80, right: 80, bottom: 80, left: 80})
            .dimension(this.dim.date)
            .group(byTimeOfDay)
            .keyAccessor(function(p, v) {return p.value.momentStartOfDay; })
            .valueAccessor(function(p, v) {return p.value.timeOfDay; })
            .radiusValueAccessor(function(p) {return 1.00; })
            .x(d3.time.scale().domain([minDate.toDate(), maxDate.toDate()]))
            .y(d3.scale.linear().domain([-0.5, 23.5]))
            .r(d3.scale.linear().domain([0, 24.0 / 0.5]));

        dc.renderAll();
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

