
// make a new map
let map:Map = new Map('leaflet');

// make a new dataloader
let dataLoader:DataLoader = new DataLoader();

// configure the dataLoader
dataLoader.limit = 100;

// attempt to call Map's binddata method after data is loaded
dataLoader.callback = map.binddata;

// load the data
dataLoader.loadData();






