
interface IDataRow {
    date: Date;
    casenumber: string;
    description: string;
    primary: string;
    latitude: number;
    longitude: number;
}





class Histogram {

    private _countdata                 : Array<any>;
    private _dateExtent                : Array<Date>;
    private _dateTimeFirst             : Date;
    private _dateTimeLast              : Date;
    private _max                       : number;
    private _min                       : number;
    private _nMilliSecondsPerDay       : number;
    private _numberOfRecords           : number;
    private _xDomainExtent             : number;
    private _xDomainFrom               : Date;
    private _xDomainSpacing            : number;
    private _xDomainTo                 : Date;
    private _yDomainExtent             : number;
    private _yDomainFrom               : number;
    private _yDomainSpacing            : number;
    private _yDomainTo                 : number;

    constructor (data: IDataRow) {

        this.nMilliSecondsPerDay = 60 * 60 * 24 * 1000;

        this.numberOfRecords = (data as any).length;

        // get the minimum and maximum datetime stamps from the dataset:
        this.dateExtent = d3.extent(data as any, function (d: any) {return d.date; });
        this.dateTimeFirst = this.dateExtent[0];
        this.dateTimeLast = this.dateExtent[1];

        // size descriptors of the horizontal dimension
        this.xDomainFrom = new Date(this.dateExtent[0].getFullYear(),
                                    this.dateExtent[0].getMonth(),
                                    this.dateExtent[0].getDate(), 0, 0, 0);
        this.xDomainTo = new Date(this.dateExtent[1].getFullYear(),
                                  this.dateExtent[1].getMonth(),
                                  this.dateExtent[1].getDate(), 0, 0, 0, this.nMilliSecondsPerDay);
        this.xDomainSpacing = 1;
        this.xDomainExtent = (this.xDomainTo.getTime() - this.xDomainFrom.getTime()) / this.nMilliSecondsPerDay;

        // size descriptors of the vertical dimension
        this.yDomainFrom = 0;
        this.yDomainTo = 24;
        this.yDomainSpacing = 1;
        this.yDomainExtent = this.yDomainTo - this.yDomainFrom;

        // initialize histogram
        let iElem:number;
        let nDays = this.xDomainExtent;
        let nHours = this.yDomainExtent;
        let iDay:number;
        let iHour:number;

        iElem = 0;

        // not sure why, but you need this next line:
        this.countData = new Array(nDays * nHours);

        for (iDay = 0; iDay < nDays; iDay += 1) {
            for (iHour = 0; iHour < nHours; iHour += 1) {
                this.countData[iElem] = {
                    'count': null,
                    'dateFrom': new Date(this.xDomainFrom.getTime() + this.nMilliSecondsPerDay * iDay),
                    'dateTo': new Date(this.xDomainFrom.getTime() + this.nMilliSecondsPerDay * (iDay + 1)),
                    'todFrom': iHour,
                    'todTo': iHour + 1
                };
                iElem += 1;
            }
        }

        // loop over the elements in the array and make a tally of how many data
        // points fall within that element's boundaries:
        this.tally(data);

    } // end constructor



    private tally(data: IDataRow) {

        let iDay:number;
        let iHour:number;

        // count occurences
        for (let elem of data as any) {

            iDay = Math.floor((elem.date.getTime() - this.xDomainFrom.getTime()) / this.nMilliSecondsPerDay / this.xDomainSpacing);
            iHour = Math.floor((elem.date.getHours() - this.yDomainFrom) / this.yDomainSpacing);

            let iElem = iDay * 24 + iHour;

            this.countData[iElem].count += 1;
        }

        // determine the maximum value in the histogram
        this.min = d3.extent(this.countData, function (d: any) {return d.count; })[0];
        this.max = d3.extent(this.countData, function (d: any) {return d.count; })[1];

    } // end function tally()




    // getters and setters

    public get countData():Array<any> {
        return this._countdata;
    }

    public set countData(countData:Array<any>) {
        this._countdata = countData;
    }

    public get dateExtent():Array<Date> {
        return this._dateExtent;
    }

    public set dateExtent(dateExtent:Array<Date>) {
        this._dateExtent = dateExtent;
    }

    public get dateTimeFirst():Date {
        return this._dateTimeFirst;
    }

    public set dateTimeFirst(dateTimeFirst:Date) {
        this._dateTimeFirst = dateTimeFirst;
    }

    public get dateTimeLast():Date {
        return this._dateTimeLast;
    }

    public set dateTimeLast(dateTimeLast:Date) {
        this._dateTimeLast = dateTimeLast;
    }

    public set max(max:number) {
        this._max = max;
    }

    public get max():number {
        return this._max;
    }

    public set min(min:number) {
        this._min = min;
    }

    public get min():number {
        return this._min;
    }

    public set nMilliSecondsPerDay(nMilliSecondsPerDay:number) {
        this._nMilliSecondsPerDay = nMilliSecondsPerDay;
    }

    public get nMilliSecondsPerDay():number {
        return this._nMilliSecondsPerDay;
    }

    public set numberOfRecords(numberOfRecords:number) {
        this._numberOfRecords = numberOfRecords;
    }

    public get numberOfRecords():number {
        return this._numberOfRecords;
    }

    public set xDomainExtent(xDomainExtent:number) {
        this._xDomainExtent = xDomainExtent;
    }

    public get xDomainExtent():number {
        return this._xDomainExtent;
    }

    public set xDomainFrom(xDomainFrom:Date) {
        this._xDomainFrom = xDomainFrom;
    }

    public get xDomainFrom():Date {
        return this._xDomainFrom;
    }

    public set xDomainSpacing(xDomainSpacing:number) {
        this._xDomainSpacing = xDomainSpacing;
    }

    public get xDomainSpacing():number {

        return this._xDomainSpacing;
    }

    public set xDomainTo(xDomainTo:Date) {
        this._xDomainTo = xDomainTo;
    }

    public get xDomainTo():Date {
        return this._xDomainTo;
    }

    public set yDomainExtent(yDomainExtent:number) {
        this._yDomainExtent = yDomainExtent;
    }

    public get yDomainExtent():number {
        return this._yDomainExtent;
    }

    public set yDomainFrom(yDomainFrom:number) {
        this._yDomainFrom = yDomainFrom;
    }

    public get yDomainFrom():number {
        return this._yDomainFrom;
    }

    public set yDomainSpacing(yDomainSpacing:number) {
        this._yDomainSpacing = yDomainSpacing;
    }

    public get yDomainSpacing():number {
        return this._yDomainSpacing;
    }

    public set yDomainTo(yDomainTo:number) {
        this._yDomainTo = yDomainTo;
    }

    public get yDomainTo():number {
        return this._yDomainTo;
    }




} // end class Histogram
