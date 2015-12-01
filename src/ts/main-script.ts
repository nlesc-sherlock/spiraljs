


// make a new dataloader
let dataloader:DataLoader = new DataLoader();

// configure the dataLoader
dataloader.limit = 100;

// load the data
dataloader.loadData();


function doit(data: any) {

    // make a new map
    let map:Map = new Map('leaflet');
    map.binddata(data);
    map.circleMarkerOptions = {
        fillColor  : '#F80',
        fillOpacity: 0.5,
        stroke     : true,
        color      : '#000'
    };
    map.circleMarkerRadius = 6;
    map.showCrimeLocations();


    let histogram:Histogram = new Histogram(dataloader.data);
    console.log(histogram);

};
