var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Map = (function (_super) {
    __extends(Map, _super);
    function Map(id, options) {
        d3.select(id)
            .attr('width', window.innerWidth * 0.5)
            .attr('height', window.innerHeight * 0.5);
        _super.call(this, id, options);
        if (id === undefined) {
            console.log('You need to define the name of div element to put the leaflet amp into.');
        }
    }
    Map.prototype.init = function () {
        var mapOptions = {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href=\'http://openstreetmap.org\'>OpenStreetMap</a> contributors, ' +
                '<a href=\'http://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, ' +
                'Imagery &copy; <a href=\'http://mapbox.com\'>Mapbox</a>',
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ'
        };
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', mapOptions).addTo(this);
    };
    Map.prototype.binddata = function (data) {
        this._data = data;
        this._bbox = this.calcBoundingBox();
        this.fitBounds(this._bbox);
    };
    Map.prototype.calcBoundingBox = function () {
        var _latLngs = [];
        for (var _i = 0, _a = this._data; _i < _a.length; _i++) {
            var elem = _a[_i];
            _latLngs.push(new L.LatLng(elem.latitude, elem.longitude));
        }
        return L.latLngBounds(_latLngs);
    };
    return Map;
})(L.Map);
