var Histogram = (function () {
    function Histogram(data) {
        this.nMilliSecondsPerDay = 60 * 60 * 24 * 1000;
        this.numberOfRecords = data.length;
        this.dateTimeFirst = this.dateExtent[0];
        this.dateTimeLast = this.dateExtent[1];
        this.xDomainFrom = new Date(this.dateExtent[0].getFullYear(), this.dateExtent[0].getMonth(), this.dateExtent[0].getDate(), 0, 0, 0);
        this.xDomainTo = new Date(this.dateExtent[1].getFullYear(), this.dateExtent[1].getMonth(), this.dateExtent[1].getDate(), 0, 0, 0, this.nMilliSecondsPerDay);
        this.xDomainSpacing = 1;
        this.xDomainExtent = (this.xDomainTo.getTime() - this.xDomainFrom.getTime()) / this.nMilliSecondsPerDay;
        this.yDomainFrom = 0;
        this.yDomainTo = 24;
        this.yDomainSpacing = 1;
        this.yDomainExtent = this.yDomainTo - this.yDomainFrom;
        var iElem;
        var nDays = this.xDomainExtent;
        var nHours = this.yDomainExtent;
        var iDay;
        var iHour;
        iElem = 0;
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
        this.tally(data);
    }
    Histogram.prototype.tally = function (data) {
        var iDay;
        var iHour;
        for (var _i = 0, _a = data; _i < _a.length; _i++) {
            var elem = _a[_i];
            iDay = Math.floor((elem.date.getTime() - this.xDomainFrom.getTime()) / this.nMilliSecondsPerDay / this.xDomainSpacing);
            iHour = Math.floor((elem.date.getHours() - this.yDomainFrom) / this.yDomainSpacing);
            var iElem = iDay * 24 + iHour;
            this.countData[iElem].count += 1;
        }
        this.min = d3.extent(this.countData, function (d) { return d.count; })[0];
        this.max = d3.extent(this.countData, function (d) { return d.count; })[1];
    };
    Object.defineProperty(Histogram.prototype, "countData", {
        get: function () {
            return this._countdata;
        },
        set: function (countData) {
            this._countdata = countData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "dateExtent", {
        get: function () {
            return this._dateExtent;
        },
        set: function (dateExtent) {
            this._dateExtent = dateExtent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "dateTimeFirst", {
        get: function () {
            return this._dateTimeFirst;
        },
        set: function (dateTimeFirst) {
            this._dateTimeFirst = dateTimeFirst;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "dateTimeLast", {
        get: function () {
            return this._dateTimeLast;
        },
        set: function (dateTimeLast) {
            this._dateTimeLast = dateTimeLast;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (max) {
            this._max = max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (min) {
            this._min = min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "nMilliSecondsPerDay", {
        get: function () {
            return this._nMilliSecondsPerDay;
        },
        set: function (nMilliSecondsPerDay) {
            this._nMilliSecondsPerDay = nMilliSecondsPerDay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "numberOfRecords", {
        get: function () {
            return this._numberOfRecords;
        },
        set: function (numberOfRecords) {
            this._numberOfRecords = numberOfRecords;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "xDomainExtent", {
        get: function () {
            return this._xDomainExtent;
        },
        set: function (xDomainExtent) {
            this._xDomainExtent = xDomainExtent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "xDomainFrom", {
        get: function () {
            return this._xDomainFrom;
        },
        set: function (xDomainFrom) {
            this._xDomainFrom = xDomainFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "xDomainSpacing", {
        get: function () {
            return this._xDomainSpacing;
        },
        set: function (xDomainSpacing) {
            this._xDomainSpacing = xDomainSpacing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "xDomainTo", {
        get: function () {
            return this._xDomainTo;
        },
        set: function (xDomainTo) {
            this._xDomainTo = xDomainTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "yDomainExtent", {
        get: function () {
            return this._yDomainExtent;
        },
        set: function (yDomainExtent) {
            this._yDomainExtent = yDomainExtent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "yDomainFrom", {
        get: function () {
            return this._yDomainFrom;
        },
        set: function (yDomainFrom) {
            this._yDomainFrom = yDomainFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "yDomainSpacing", {
        get: function () {
            return this._yDomainSpacing;
        },
        set: function (yDomainSpacing) {
            this._yDomainSpacing = yDomainSpacing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Histogram.prototype, "yDomainTo", {
        get: function () {
            return this._yDomainTo;
        },
        set: function (yDomainTo) {
            this._yDomainTo = yDomainTo;
        },
        enumerable: true,
        configurable: true
    });
    return Histogram;
})();
