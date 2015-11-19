var map = new Map('leaflet');
var dataloader = new DataLoader();
dataloader.limit = 100;
dataloader.loadData();
map.binddata(dataloader._data);
