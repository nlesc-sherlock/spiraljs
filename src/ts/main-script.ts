/// <reference path="../../typings/moment/moment.d.ts" />

let map: Map;
let histogram: Histogram;
let heatmap: Heatmap;
let punchcard: Punchcard;
let oneDimensionalHistogram1: OneDimensionalHistogram;
let oneDimensionalHistogram2: OneDimensionalHistogram;
let spiral: Spiral;

var start:moment.Moment;


// record the start of the visualization for performance analysis
start = moment();
console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: script starts');



function doit(data: IDataRow[]) {

    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: doit() starts');
    // convert the datestr property to a moment.js date
    data.forEach(function(d:IDataRow){
        // d.moment calculation is already done in DataLoader.loaddata(), and
        // there it's also using timezone information
        d.momentStartOfDay = d.moment.clone().startOf('day');
        d.timeOfDay = d.moment.diff(d.momentStartOfDay, 'hour');
    });
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: adding properties to data done');

    let cf:any = crossfilter(data);
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: crossfilter object done');

    oneDimensionalHistogram1 = new OneDimensionalHistogram(cf, 'one-dimensional-histogram-total-arrests-per-day');
    oneDimensionalHistogram1.draw();
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: oneDimensionalHistogram1 done');

    oneDimensionalHistogram2 = new OneDimensionalHistogram(cf, 'odh');
    oneDimensionalHistogram2.draw();
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: oneDimensionalHistogram2 done');

    // make a new map
    map = new Map('leaflet');
    map.data = data;
    map.circleMarkerOptions = {
        fillColor: '#8F0',
        fillOpacity: 1.0,
        stroke: true,
        color: '#000'
    };
    map.circleMarkerRadius = 4;
    map.showCrimeLocations();

    // make the histogram and then add it to the timeline
    histogram = new Histogram(data);
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: histogram done');

    heatmap = new Heatmap('heatmap', histogram);
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: heatmap done');

    spiral = new Spiral('spiral');
    spiral.data = data;
    spiral.render();
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: spiral done');

    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: doit() done');

};



// make a new dataloader
let dataloader: DataLoader = new DataLoader();


// configure the dataloader
dataloader.limit = 50000;

// set the offset to a large value to get to the more recent records (the
// results are sorted by increasing date); the more recent records are more
// likely to have valid coordinates.
dataloader.offset = 10000;

// load the data
dataloader.loadData(doit);

