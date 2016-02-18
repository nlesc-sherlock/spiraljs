
/// <reference path="../../typings/tsd.d.ts" />


class Map extends L.Map {

    private _data               : IDataRow[];
    private _bbox               : L.LatLngBounds;
    private _tileLayerOptions   : L.TileLayerOptions;
    private _circleMarkerOptions: L.PathOptions;
    private _circleMarkerRadius : Number;

    constructor (id: string, options?: L.Map.MapOptions) {

        if (id === undefined) {
            console.log('You need to define the name of div element to put the leaflet map into.');
        }

        super(id, options);

        this.fitWorld();

        this._tileLayerOptions = {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href=\'http://openstreetmap.org\'>OpenStreetMap</a> contributors, ' +
                '<a href=\'http://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, ' +
                'Imagery &copy; <a href=\'http://mapbox.com\'>Mapbox</a>',
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoianNwYWFrcyIsImEiOiJjaWtwYTBsbzExMGkxdXhrbTc4dDcxZ2VtIn0.Rce9VSZkErGEXl9_2HhUkw'
        };
        this._circleMarkerOptions = {
            color: '#f20'
        };
        this.circleMarkerRadius = 12;

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', this._tileLayerOptions).addTo(this);

    }




    public binddata(data:IDataRow[]) {
        this._data = data;
        this._bbox = this.calcBoundingBox();
        this.setView([(this._bbox.getNorth() + this._bbox.getSouth()) / 2,
                      (this._bbox.getEast() + this._bbox.getWest()) / 2]);

        this.fitBounds(this._bbox);

    }




    public calcBoundingBox():L.LatLngBounds {

        let _latLngs: Array<L.LatLng> = [];

        for (let elem of this._data) {
            _latLngs.push(L.latLng(elem.latitude, elem.longitude));
        }
        return L.latLngBounds(_latLngs);
    }




    public showCrimeLocations() {

        for (let elem of this._data) {
            let pos = L.latLng(elem.latitude, elem.longitude);
            L.circleMarker(pos, this._circleMarkerOptions).setRadius(5).addTo(this);
        }
    }




    public set circleMarkerOptions(circleMarkerOptions:L.PathOptions) {
        this._circleMarkerOptions = circleMarkerOptions;
    }




    public get circleMarkerOptions():L.PathOptions {
        return this._circleMarkerOptions;
    }




    public set circleMarkerRadius(circleMarkerRadius:Number) {
        this._circleMarkerRadius = circleMarkerRadius;
    }




    public get circleMarkerRadius():Number {
        return this._circleMarkerRadius;
    }




}





