/// <reference path="../../typings/leaflet/leaflet.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />



class DataLoader {

    private _baseurl  : string;
    private _data     : any;
    private _offset   : number;
    private _limit    : number;
    private _query    : string;
    private _select   : string;
    private _where    : string;
    private _url      : string;

    constructor () {

        // the location of the API
        this._baseurl = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json';

        // the maximum number of results
        this._limit = 10;

        // where to start when returning records (0 = most recent)
        this._offset = 0;

        // which column to include, and how each should be called
        this._select = 'case_number AS casenumber, date AS datestr, description, primary_type AS primary, latitude, longitude';

        // set the default 'where' condition string
        this._where = '';

        // build the query with the default options:
        this.buildQuery();

        // add timezone information for chicago (not sure what year range this is;
        // from http://momentjs.com/downloads/moment-timezone-with-data.js)
        moment.tz.add('America/Chicago|CST CDT EST CWT CPT|60 50 50 50 50|01010101010101010101010101010101010' +
            '102010101010103401010101010101010101010101010101010101010101010101010101010101010101010101010101' +
            '010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101' +
            '010101010|-261s0 1nX0 11B0 1nX0 1wp0 TX0 WN0 1qL0 1cN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 ' +
            '1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 11B0 1Hz0 ' +
            '14p0 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 ' +
            '1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 ' +
            '1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 ' +
            '1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 ' +
            '1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 ' +
            '1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 ' +
            '14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 ' +
            ' Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 ' +
            '1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 ' +
            'Op0 1zb0 Op0 1zb0');

    }




    public loadData(callback:any) {

        // capture the 'this' object from the current context
        let that = this;

        let xmlHttp = new XMLHttpRequest();

        // define what to do after the data has been downloaded successfully
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.status === 429) {
                console.log('Throttle limit exceeded. See "https://dev.socrata.com/docs/' +
                            'app-tokens.html#throttling-limits" for more information.');
            }
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                that._data = JSON.parse(xmlHttp.responseText);
                for (let elem of that._data) {
                    elem.moment = moment.tz(elem.datestr, 'YYYY-MM-DDTHH:mm:ss', 'America/Chicago');
                }
                console.log('Done loading.');

                // remove records that are invalid for whatever reason
                that.clean();
                // execute the callback
                callback(that._data);
            }
        };

        // make the actual request
        xmlHttp.open('GET', this._query, true); // true for asynchronous

        // not sure what this is...end the connection?
        xmlHttp.send(null);

    }




    public clean() {
        let iElem : number;
        let nElems: number;

        iElem = 0;
        nElems = this._data.length;

        let invalid:number[] = [];

        console.log(this._data.length);
        for (iElem = 0; iElem < nElems; iElem += 1) {
            let elem =  this._data[iElem];
            try {
                if (typeof elem.latitude === 'undefined') {
                    throw new Error('No latitude in this record.');
                }
                if (isNaN(elem.latitude)) {
                    throw new Error('Latitude for this record is NaN.');
                }
                if (typeof elem.longitude === 'undefined' ) {
                    throw new Error('No longitude in this record.');
                }
                if (isNaN(elem.longitude)) {
                    throw new Error('Longitude for this record is NaN.');
                }

                // try if this works, just to see if we may get into trouble later:
                let pos = L.latLng(elem.latitude, elem.longitude);

            } catch (err) {

                this._data[iElem].latitude = 0.0;
                this._data[iElem].longitude = 0.0;
                invalid.push(iElem);
            }
        }

        for (let iInvalid of invalid.reverse()) {
            this._data.splice(iInvalid, 1);
        }
    }




    private buildQuery() {

        // see also:
        // https://dev.socrata.com/docs/functions/#,
        // for more on SoQL functions

        this._query = this._baseurl + '?' +
            '&' + '$order=date' +
            '&' + '$limit=' + (this._limit) +
            '&' + '$offset=' + (this._offset) +
            '&' + '$select=' + (this._select) +
            '&' + '$where=' + (this._where);

    }




    public get data():any {
        return this._data;
    }

    public set limit(limit) {
        this._limit = limit;
        this.buildQuery();
    }

    public get limit():number {
        return this._limit;
    }

    public set offset(offset) {
        this._offset = offset;
        this.buildQuery();
    }

    public get offset():number {
        return this._offset;
    }



}

