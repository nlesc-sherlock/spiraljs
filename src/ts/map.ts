
/// <reference path="../../typings/tsd.d.ts" />


class Map extends L.Map {

    private _data: IDataRow[];
    private _bbox: L.LatLngBounds;

    constructor (id: string, options?: L.Map.MapOptions) {

        d3.select(id)
            .attr('width', window.innerWidth * 0.5)
            .attr('height', window.innerHeight * 0.5);  // doesnt work yet

        super(id, options);

        if (id === undefined) {
            console.log('You need to define the name of div element to put the leaflet amp into.');
        }

    }

    public init() {
        // parent object L.Map already has a method .initialize()

        let mapOptions = {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href=\'http://openstreetmap.org\'>OpenStreetMap</a> contributors, ' +
				'<a href=\'http://creativecommons.org/licenses/by-sa/2.0/\'>CC-BY-SA</a>, ' +
				'Imagery &copy; <a href=\'http://mapbox.com\'>Mapbox</a>',
			id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ'
        };

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', mapOptions).addTo(this);

    }


    public binddata(data:any) {
        this._data = data;
        this._bbox = this.calcBoundingBox();
        // this.setView([(this._bbox.getNorth() + this._bbox.getSouth()) / 2,
        //               (this._bbox.getEast() + this._bbox.getWest()) / 2]);
        //
        this.fitBounds(this._bbox);
    }


    public calcBoundingBox():L.LatLngBounds {

        let _latLngs: Array<L.LatLng> = [];

        for (let elem of this._data) {
            _latLngs.push(new L.LatLng(elem.latitude, elem.longitude));
        }
        return L.latLngBounds(_latLngs);
    }

}





