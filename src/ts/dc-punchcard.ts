/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />



class DcPunchcard {

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

        let nHoursPerDay:number = 24.0;

        this.dim.date = this.cf.dimension(function(d:IDataRow):moment.Moment{
            return d.momentStartOfDay.clone().add(d.timeOfDay / nHoursPerDay, 'hour');
        });
    }




    public draw() {

        let minDate = this.dim.date.bottom(1)[0].moment
            .clone()
            .startOf('day')
            .utc();
        let maxDate = this.dim.date.top(1)[0].moment
            .clone()
            .endOf('day')
            .utc();

        let byTimeOfDay = this.dim.date.group().reduce(
            function(p, v) {
                // reduceAdd()
                // p: a transient instance of the reduced object.
                // v: the current record.
                p.count = p.count + 1;
                p.date = v.momentStartOfDay;
                p.tod = v.timeOfDay;
                return p;
            },
            function(p, v) {
                // reduceRemove()
                // p: a transient instance of the reduced object.
                // v: the current record.
                p.count = p.count - 1;
                p.date = v.momentStartOfDay;
                p.tod = v.timeOfDay;
                return p;
            },
            function() {
                // reduceInitial()
                return {
                    count: 0,
                    date: undefined,
                    tod: undefined
                };
            }
        );

        let nHoursPerDay:number = 24.0;

        dc.bubbleChart('#' + this.domElemId)
            .width(this.domElem.clientWidth)
            .height(this.domElem.clientHeight)
            .margins({top: 80, right: 80, bottom: 80, left: 80})
            .dimension(this.dim.date)
            .group(byTimeOfDay)
            .elasticX(false)
            .x(d3.time.scale.utc().domain([minDate, maxDate]))
            .y(d3.scale.linear().domain([nHoursPerDay, 0]))
            .r(d3.scale.linear().domain([0, 100 * 2 * nHoursPerDay ]))
            .colorDomain([0, 100])
            .keyAccessor(function(p, v) {return p.value.date; })
            .valueAccessor(function(p, v) {return p.value.tod; })
            .radiusValueAccessor(function(p) {return 1 / nHoursPerDay / 2; })
            .colorAccessor(function(p) {return p.value.count; })
            .renderLabel(false)
            .xAxisLabel('Date UTC')
            .yAxisLabel('Time of day (local?)')
            .brushOn(true);

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

