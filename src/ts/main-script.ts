


// make a new map
let map:Map = new Map('leaflet');

// make a new dataloader
let dataloader:DataLoader = new DataLoader();

// configure the dataLoader
dataloader.limit = 100;

// load the data
dataloader.loadData();


map.binddata(dataloader._data);





