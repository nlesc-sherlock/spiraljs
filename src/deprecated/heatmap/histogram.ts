
class Histogram {

    private _countdata                 : Array<any>;
    private _dateExtent                : moment.Moment[];
    private _dateTimeFirst             : moment.Moment;
    private _dateTimeLast              : moment.Moment;
    private _max                       : number;
    private _min                       : number;
    private _nMilliSecondsPerDay       : number;
    private _numberOfRecords           : number;
    private _xDomainExtent             : number;
    private _xDomainFrom               : moment.Moment;
    private _xDomainTo                 : moment.Moment;
    private _yDomainExtent             : number;
    private _yDomainFrom               : number;
    private _yDomainSpacing            : number;
    private _yDomainTo                 : number;

    constructor (data: IDataRow[]) {

        this.nMilliSecondsPerDay = 60 * 60 * 24 * 1000;

        this.numberOfRecords = data.length;

        // get the minimum and maximum datetime stamps from the dataset:
        this.dateExtent = [];
        this.dateExtent[0] = data[0].moment;
        this.dateExtent[1] = data[0].moment;
        for (let elem of data) {
            if (elem.moment < this.dateExtent[0]) {
                this.dateExtent[0] = elem.moment.clone();
            }
            if (elem.moment > this.dateExtent[1]) {
                this.dateExtent[1] = elem.moment.clone();
            }
        }

        this.dateTimeFirst = this.dateExtent[0].clone();
        this.dateTimeLast = this.dateExtent[1].clone();

        // size descriptors of the horizontal dimension
        this.xDomainFrom = this.dateExtent[0].clone().startOf('day');
        this.xDomainTo = this.dateExtent[1].clone().add(1, 'days').startOf('day');

        this.xDomainExtent = this.xDomainTo.diff(this.xDomainFrom, 'days', false);

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
                    'dateFrom': this.xDomainFrom.clone().add(moment.duration(iDay, 'days')),
                    'dateTo': this.xDomainFrom.clone().add(moment.duration(iDay + 1, 'days')),
                    'todFrom': iHour,
                    'todTo': iHour + 1
                };

                // console.log('dateFrom: ' + this.countData[iElem].dateFrom.toString());
                // console.log('dateTo  : ' + this.countData[iElem].dateTo.toString());
                // console.log('todFrom : ' + this.countData[iElem].todFrom);
                // console.log('todTo   : ' + this.countData[iElem].todTo);

                iElem += 1;
            }
        }

        // loop over the elements in the array and make a tally of how many data
        // points fall within that element's boundaries:
        this.tally(data);

    } // end constructor



    private tally(data: IDataRow[]) {

        let iDay:number;
        let iHour:number;

        // count occurences
        for (let elem of data) {

            iDay = Math.floor(elem.moment.diff(this.xDomainFrom, 'days', true));
            iHour = Math.floor(elem.moment.diff(elem.moment.clone().startOf('day'), 'hours', true));

            let iElem = iDay * 24 + iHour;

            if (this.countData[iElem].count) {
                this.countData[iElem].count += 1;
            } else {
                this.countData[iElem].count = 1;
            }
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

    public get dateExtent():Array<moment.Moment> {
        return this._dateExtent;
    }

    public set dateExtent(dateExtent:Array<moment.Moment>) {
        this._dateExtent = dateExtent;
    }

    public get dateTimeFirst():moment.Moment {
        return this._dateTimeFirst;
    }

    public set dateTimeFirst(dateTimeFirst:moment.Moment) {
        this._dateTimeFirst = dateTimeFirst;
    }

    public get dateTimeLast():moment.Moment {
        return this._dateTimeLast;
    }

    public set dateTimeLast(dateTimeLast:moment.Moment) {
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

    public set xDomainFrom(xDomainFrom:moment.Moment) {
        this._xDomainFrom = xDomainFrom;
    }

    public get xDomainFrom():moment.Moment {
        return this._xDomainFrom;
    }

    public set xDomainTo(xDomainTo:moment.Moment) {
        this._xDomainTo = xDomainTo;
    }

    public get xDomainTo():moment.Moment {
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
