/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />


class DcDataTable {

    private _cf:any;
    private _dim: any;
    private _domElem: HTMLElement;
    private _domElemId: string;

    constructor (cf: any, domElemId:string) {

        // constructor function
        this.cf = cf;

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        this.dim = {};

        // define a dimension 'date':
        this.dim.date = this.cf.dimension(function(fact:IDataRow){
            return fact.moment;
        });


        dc.dataTable('#table1')
            .dimension(this.dim.date)
            .group(function (d) {
                    return d.moment;
                })
            .columns([
                function(d){
                    return d.moment;
                },
                function(d) {
                    return d.primary.toLowerCase();
                }
            ])
            .sortBy(function (d){
                    return d.moment;
                })
            .order(d3.ascending)
            .size(Infinity);

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


}

