var DataLoader = (function () {
    function DataLoader() {
        this._baseurl = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json';
        this._limit = 10;
        this._offset = 0;
        this._select = 'case_number AS casenumber, date, description, primary_type AS primary, latitude, longitude';
        this.buildQuery();
    }
    DataLoader.prototype.callback = function (_this) {
        this._data = _this._data;
    };
    DataLoader.prototype.loadData = function () {
        var that = this;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status === 429) {
                console.log('Throttle limit exceeded. See "https://dev.socrata.com/docs/' +
                    'app-tokens.html#throttling-limits" for more information.');
            }
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                var tmpdata = JSON.parse(xmlHttp.responseText);
                that._data = tmpdata;
                for (var _i = 0; _i < tmpdata.length; _i++) {
                    var elem = tmpdata[_i];
                    elem.date = new Date(elem.date);
                }
                that.callback(that);
            }
        };
        xmlHttp.open('GET', this._query, true);
        xmlHttp.send(null);
    };
    DataLoader.prototype.buildQuery = function () {
        this._query = this._baseurl + '?' + '$limit=' + (this._limit) +
            '&' + '$offset=' + (this._offset) +
            '&' + '$select=' + (this._select);
    };
    DataLoader.prototype.getDataFun = function (responseText) {
        var tmpdata = JSON.parse(responseText);
        for (var _i = 0; _i < tmpdata.length; _i++) {
            var elem = tmpdata[_i];
            elem.date = new Date(elem.date);
        }
        this._data = tmpdata;
        console.log('loading data complete.');
    };
    Object.defineProperty(DataLoader.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataLoader.prototype, "limit", {
        get: function () {
            return this._limit;
        },
        set: function (limit) {
            this._limit = limit;
            this.buildQuery();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataLoader.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (offset) {
            this._offset = offset;
            this.buildQuery();
        },
        enumerable: true,
        configurable: true
    });
    return DataLoader;
})();
