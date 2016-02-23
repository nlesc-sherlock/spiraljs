// let map: Map;
let histogram: Histogram;
let heatmap: Heatmap;
let punchcard: Punchcard;
let oneDimensionalHistogram1: OneDimensionalHistogram;
let oneDimensionalHistogram2: OneDimensionalHistogram;
let spiral: Spiral;



function doit(data: IDataRow[]) {

    // convert the datestr property to a moment.js date
    data.forEach(function(d:IDataRow){
        d.moment = moment(d.datestr);
        d.momentStartOfDay = d.moment.clone().startOf('day');
        d.timeOfDay = d.moment.diff(d.momentStartOfDay, 'hour');
    });

    let cf:any = crossfilter(data);


    oneDimensionalHistogram1 = new OneDimensionalHistogram(cf, 'one-dimensional-histogram-total-arrests-per-day');
    oneDimensionalHistogram1.draw();

    oneDimensionalHistogram2 = new OneDimensionalHistogram(cf, 'odh');
    oneDimensionalHistogram2.draw();

    // make a new map
    // map = new Map('leaflet');
    // map.binddata(data);
    // map.circleMarkerOptions = {
    //     fillColor: '#8F0',
    //     fillOpacity: 1.0,
    //     stroke: true,
    //     color: '#000'
    // };
    // map.circleMarkerRadius = 4;
    // map.showCrimeLocations();

    // make the histogram and then add it to the timeline
    histogram = new Histogram(data);
    heatmap = new Heatmap('heatmap', histogram);

    spiral = new Spiral('spiral');
    spiral.data = data;
    spiral.render();
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

