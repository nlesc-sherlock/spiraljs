/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="idatarow.ts" />

var start:moment.Moment;


// record the start of the visualization for performance analysis
start = moment();
console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: script starts');



function doit(data: IDataRow[]) {

    let hist1             : OneDimensionalHistogram;
    let hist2             : OneDimensionalHistogram;
    let map               : Map;
    let d3PunchcardDate   : D3PunchcardDate;
    let d3PunchcardWeekday: D3PunchcardWeekday;
    let spiral            : Spiral;

    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: doit() starts');

    let cf:CrossFilter.CrossFilter<IDataRow> = crossfilter(data);
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: crossfilter object done');

    // draw the histogram using the crossfilter object and dc.js dc.barChart()
    hist1 = new OneDimensionalHistogram(cf, 'hist1-arrests-per-day');
    hist1.defineDimensions();
    hist1.draw();
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: oneDimensionalHistogram1 done');

    // draw the punchcard-weekday using the crossfilter object and D3
    d3PunchcardWeekday = new D3PunchcardWeekday(cf, 'd3-punchcard-weekday');
    d3PunchcardWeekday.defineDimensions();
    d3PunchcardWeekday.draw();
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: d3PunchcardWeekday done');

    // draw the punchcard-date using the crossfilter object and D3
    d3PunchcardDate = new D3PunchcardDate(cf, 'd3-punchcard-date');
    d3PunchcardDate.defineDimensions();
    d3PunchcardDate.draw();
    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: d3PunchcardDate done');

    // spiral = new Spiral('spiral');
    // spiral.data = data;
    // spiral.render();
    // console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: spiral done');

    // make a new map
    map = new Map('leaflet', {
        dragging: true,
        scrollWheelZoom: false,
        boxZoom: true,
    });
    map.data = data;
    map.circleMarkerOptions = {
        fillColor: '#8F0',
        fillOpacity: 1.0,
        stroke: true,
        color: '#000'
    };
    map.circleMarkerRadius = 4;
    map.showCrimeLocations();

    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: leaflet map done');

    console.log('+' + moment().diff(start, 'second', true).toFixed(3) + ' s: doit() done');

};




// make a new dataloader
let dataloader: DataLoader = new DataLoader();

// configure the dataloader
dataloader.limit = 50;

// set the offset to a large value to get to the more recent records (the
// results are sorted by increasing date); the more recent records are more
// likely to have valid coordinates.
dataloader.offset = 103450;

// load the data
dataloader.loadData(doit);



