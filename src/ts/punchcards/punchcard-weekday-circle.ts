/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="./punchcard-weekday-rect.ts" />
/// <reference path="./punchcard-colormap.ts" />



class PunchcardWeekdayCircle extends PunchcardWeekdayRect {

    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.xlabel = 'Day of week';
        this.title = 'PunchcardWeekdayCircle title';
        this.colormap = new PunchcardColorMap('blues');
    }




    protected drawSymbols():PunchcardWeekdayCircle {

        // capture the this object
        let that:PunchcardWeekdayCircle = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = {left:2, right: 2, top: 2, bottom: 2}; // pixels
        let symbolWidth :number = w / 7 - symbolMargin.left - symbolMargin.right;
        let symbolHeight:number = h / 24 - symbolMargin.top - symbolMargin.bottom;

        let r:number = Math.min(symbolWidth, symbolHeight) / 2 - 2;

        // based on example from
        // http://stackoverflow.com/questions/16766986/is-it-possible-to-group-by-multiple-dimensions-in-crossfilter
        // forEach method could be very expensive on write.
        let group = this.dim.weekdayAndHourOfDay.group();
        group.all().forEach(function(d) {
            //parse the json string created above
            d.key = JSON.parse(d.key);
        });
        let data:any = group.all();


        // determine the min and max in the count in order to set the color
        // limits on the colormap later
        let lowest = Number.POSITIVE_INFINITY;
        let highest = Number.NEGATIVE_INFINITY;
        for (let elem of data) {
            if (elem.value < lowest) {
                lowest = elem.value;
            }
            if (elem.value > highest) {
                highest = elem.value;
            }
        }
        this.colormap.cLimLow = lowest;
        this.colormap.cLimHigh = highest;


        // draw the rects
        this.svg
            .append('g')
            .attr('class', 'symbol')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .selectAll('circle.symbol')
                .data(data)
                .enter()
                .append('circle')
                    .attr('class', 'symbol')
                    .attr('cx', function(d){
                        return that.dayOfWeekScale(d.key['weekday']) + symbolMargin.left;
                    })
                    .attr('cy', function(d){
                        return that.todScale(d.key['hourOfDay']) + symbolHeight / 2 + symbolMargin.top;
                    })
                    .attr('r', function(d){
                        return Math.max(r * (d.value - that.colormap.cLimLow) / (that.colormap.cLimHigh - that.colormap.cLimLow), 1);
                    })
                    .attr('fill', function(d){
                        return that.colormap.getColorRGB(d.value);
                    });

        return this;
    }



}


