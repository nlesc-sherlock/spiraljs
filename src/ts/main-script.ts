/// <reference path="idatarow.ts" />


function doit(data: IDataRow[]) {
    let spiral: Spiral;

    spiral = new Spiral('spiral');
    spiral.data = data;
    spiral.render();
};


// make a new dataloader
let dataloader: DataLoader = new DataLoader();

// configure the dataloader
dataloader.limit = 10000;

// set the offset to a large value to get to the more recent records (the
// results are sorted by increasing date); the more recent records are more
// likely to have valid coordinates.
dataloader.offset = 5559000;

// load the data
dataloader.loadData(doit);

