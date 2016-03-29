/// <reference path="../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/dcjs/dc.d.ts" />


class DcDataTable {

    private _cf:any;
    private _dim: any;
    private _domElem: HTMLElement;
    private _domElemId: string;

    constructor (cf: any, domElemId:string) {

        this.cf = cf;

        this.domElemId = domElemId;

        this.domElem = document.getElementById(this.domElemId);

        // all the dimensions are collected into one object, dim, which is
        // initialized here:
        this.dim = {};

    }


    public defineDimensions() {
        // define a dimension 'date':
        this.dim.date = this.cf.dimension(function(fact:IDataRow){
            return fact.moment;
        });
    }




    public draw() {

        dc.dataTable('#' + this.domElemId)
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

