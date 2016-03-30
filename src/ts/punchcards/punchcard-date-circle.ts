/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="./punchcard-date-rect.ts" />



class PunchcardDateCircle extends PunchcardDateRect {


    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.marginLeft = 70;
        this.marginRight = 70;
        this.marginTop = 40;
        this.marginBottom = 110;
        this.xlabel = '';
        this.title = 'PunchcardDateCircle title';
        this.colormap = new ColorMap('blues');
    }




    protected drawSymbols():PunchcardDateCircle {

        // capture the this object
        let that:PunchcardDateCircle = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = {left:0, right: 0, top: 0, bottom: 0}; // pixels
        let wDays:number = moment(this.dateTo).diff(moment(this.dateFrom), 'days', true);

        let symbolWidth :number = w / wDays - symbolMargin.left - symbolMargin.right;
        let symbolHeight:number = h / 24.0 - symbolMargin.top - symbolMargin.bottom;

        // based on example from
        // http://stackoverflow.com/questions/16766986/is-it-possible-to-group-by-multiple-dimensions-in-crossfilter
        // forEach method could be very expensive on write.
        let group = this.dim.dateAndHourOfDay.group();
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
            .selectAll('rect.symbol')
                .data(data)
                .enter()
                .append('rect')
                    .attr('class', 'symbol')
                    .attr('x', function(d){
                        return that.dateScale(new Date(d.key.datestr));
                        })
                    .attr('y', function(d){
                        return that.todScale(parseInt(d.key.hourOfDay, 10));
                    })
                    .attr('width', symbolWidth)
                    .attr('height', symbolHeight)
                    .attr('fill', function(d){
                        return that.colormap.getColorRGB(d.value);
                    });

        return this;

    }


}


