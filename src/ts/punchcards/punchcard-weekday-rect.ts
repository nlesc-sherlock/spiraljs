/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="./punchcard-base.ts" />
/// <reference path="./punchcard-colormap.ts" />



class PunchcardWeekdayRect extends PunchcardBase {

    private _dayOfWeekScale: any;
    private _xFrom         : number;
    private _xTo           : number;


    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.marginBottom = 50;
        this.xlabel = 'Day of week';
        this.title = 'PunchcardWeekdayRect title';
        this.colormap = new PunchcardColorMap('summer');

    }




    // define the crossfilter dimensions as used by this class
    public defineDimensions():PunchcardWeekdayRect {

        // based on example from
        // http://stackoverflow.com/questions/16766986/is-it-possible-to-group-by-multiple-dimensions-in-crossfilter

        this.dim.weekdayAndHourOfDay = this.cf.dimension(function (d) {
            //stringify() and later, parse() to get keyed objects
            let m:moment.Moment = moment(d.datestr);
            return JSON.stringify({
                weekday: m.format('ddd'),
                hourOfDay: m.hour()
            });
        });

        return this;
    }




    // overrides stub method in parent class
    public draw():PunchcardWeekdayRect {

        if (this.domElem.classList.contains('hidden')) {
            // div is hidden
            return this;
        } else {
            // div is visible
            super.drawSvg();
            super.drawChartBody();
            this.drawHorizontalAxis();
            super.drawHorizontalAxisLabel();
            super.drawVerticalAxis();
            super.drawVerticalAxisLabel();
            super.drawTitle();
            this.drawSymbols();
            super.drawBox();
            this.drawControls();
            super.drawLegend();

            return this;
        }
    }





    private drawHorizontalAxis():PunchcardWeekdayRect {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;

        let range:Array<number> = [];
        let ndays:number = 7.0;
        for (let r of [0, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.0]) {
            range.push(w * r / ndays);
        }

        this.dayOfWeekScale = d3.scale.ordinal()
            .range(range)
            .domain(['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', '']);

        let xAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dayOfWeekScale)
            .tickValues(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
            .innerTickSize(5)
            .outerTickSize(0);

        this.svg.append('g')
            .attr('class', 'horizontal-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(xAxis);

        return this;

    }




    protected drawSymbols():PunchcardWeekdayRect {

        // capture the this object
        let that:PunchcardWeekdayRect = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = {left:0, right: 0, top: 0, bottom: 0}; // pixels
        let symbolWidth :number = w / 7 - symbolMargin.left - symbolMargin.right;
        let symbolHeight:number = h / 24 - symbolMargin.top - symbolMargin.bottom;

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
            .selectAll('rect.symbol')
                .data(data)
                .enter()
                .append('rect')
                    .attr('class', 'symbol')
                    .attr('x', function(d){
                        return that.dayOfWeekScale(d.key['weekday']) - symbolWidth / 2;
                    })
                    .attr('y', function(d){
                        return that.todScale(d.key['hourOfDay']);
                    })
                    .attr('width', symbolWidth)
                    .attr('height', symbolHeight)
                    .attr('fill', function(d){
                        return that.colormap.getColorRGB(d.value);
                    });

        return this;
    }




    protected set dayOfWeekScale(dayOfWeekScale:any) {
        this._dayOfWeekScale = dayOfWeekScale;
    }

    protected get dayOfWeekScale():any {
        return this._dayOfWeekScale;
    }

    protected set xFrom(xFrom:number) {
        this._xFrom = xFrom;
    }

    protected get xFrom():number {
        return this._xFrom;
    }

    protected set xTo(xTo:number) {
        this._xTo = xTo;
    }

    protected get xTo():number {
        return this._xTo;
    }



}


