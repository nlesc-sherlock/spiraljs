
class DataLoader {

    private _baseurl  : string;
    private _callback : (_this:DataLoader) => void;
    public  _data     : any;
    private _offset   : number;
    private _limit    : number;
    private _query    : string;
    private _select   : string;
    private _url      : string;

    constructor () {

        // the location of the API
        this._baseurl = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json';

        // the maximum number of results
        this._limit = 10;

        // where to start when returning records (0 = most recent)
        this._offset = 0;

        // which column to include, and how each should be called
        this._select = 'case_number AS casenumber, date, description, primary_type AS primary, latitude, longitude';

        // specify the default callback
        this._callback = this.defaultCallback;

        // build the query with the default options:
        this.buildQuery();

    }




    public defaultCallback(_this:DataLoader) {

        console.log('This is the default callback. Specify your own to do something with the data that was just loaded.');

    }




    public loadData() {
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
                //that.getDataFun(xmlHttp.responseText);
                let tmpdata = JSON.parse(xmlHttp.responseText);
                that._data = tmpdata;
                for (let elem of tmpdata) {
                    elem.date = new Date(elem.date);
                }
                that._callback(that);
            }
        };

        // make the actual request
        xmlHttp.open('GET', this._query, true); // true for asynchronous

        // not sure what this is...end the connection?
        xmlHttp.send(null);

    }




    private buildQuery() {

        this._query = this._baseurl + '?' + '$limit=' + (this._limit) +
            '&' + '$offset=' + (this._offset) +
            '&' + '$select=' + (this._select);

    }




    public getDataFun(responseText:string) {

        let tmpdata = JSON.parse(responseText);
        for (let elem of tmpdata) {
            elem.date = new Date(elem.date);
        }
        this._data = tmpdata;
        console.log('loading data complete.');
    }




    public set callback(callback:any) {
        this._callback = callback;
    }

    public get callback():any {
        return this._callback;
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

