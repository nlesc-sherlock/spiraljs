/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="./punchcard-base.ts" />



class PunchcardDateRect extends PunchcardBase {

    private _dateScale   : any;
    private _dateFrom    : Date;
    private _dateTo      : Date;


    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.xlabel = '';
        this.title = 'PunchcardDateRect title';
        this.colormap = new PunchcardColorMap('default');
    }




    // define the crossfilter dimensions as used by this class
    public defineDimensions():PunchcardDateRect {

        // based on example from
        // http://stackoverflow.com/questions/16766986/is-it-possible-to-group-by-multiple-dimensions-in-crossfilter
        this.dim.dateAndHourOfDay = this.cf.dimension(function (d) {
            let m:moment.Moment = moment(d.datestr);
            //stringify() and later, parse() to get keyed objects
            return JSON.stringify({
                datestr: m.format('YYYY-MM-DD'),
                hourOfDay: m.hour()
            });
        });
        return this;
    }




    // overrides stub method in parent class
    public draw():PunchcardDateRect {

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
            super.drawControls();
            super.drawLegend();

            return this;
        }
    }




    private drawHorizontalAxis():PunchcardDateRect {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;

        let firstResultDate = new Date(this.dim.dateAndHourOfDay.bottom(1)[0].datestr);
        this.dateFrom = new Date(firstResultDate.getFullYear(), firstResultDate.getMonth(), firstResultDate.getDate(), 0, 0, 0, 0);

        let lastResultDate = new Date(this.dim.dateAndHourOfDay.top(1)[0].datestr);
        this.dateTo = new Date(lastResultDate.getFullYear(), lastResultDate.getMonth(), lastResultDate.getDate(), 23, 59, 59, 999);

        let tickFormat;
        let ticks;
        let nHoursDiff: number = moment(this.dateTo).diff(moment(this.dateFrom), 'hour', true);

        if (nHoursDiff > 5 * 24) {
            tickFormat = d3.time.format('%a %b %-d, %Y');
            ticks = 7;
        } else {
            tickFormat = d3.time.format('%a %b %-d, %Y');
            ticks = d3.time.days;
        };

        this.dateScale = d3.time.scale()
            .range([0, w])
            .domain([this.dateFrom,
                     this.dateTo]);

        let dateAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dateScale)
            .ticks(ticks)
            .tickFormat(tickFormat);

        this.svg.append('g')
            .attr('class', 'horizontal-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(dateAxis);

        // doing style stuff in JavaScript is considered bad practice...:
        this.svg.select('.horizontal-axis')
            .selectAll('text')
                .attr('x', -10)
                .attr('y', 0)
                .attr('dy', '.35em')
                .style('text-anchor', 'end');

        return this;

    }




    protected drawSymbols():PunchcardDateRect {

        // capture the this object
        let that:PunchcardDateRect = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight - this.legendWidth;
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




    protected set dateScale(dateScale:any) {
        this._dateScale = dateScale;
    }

    protected get dateScale():any {
        return this._dateScale;
    }

    protected set dateFrom(dateFrom:Date) {
        this._dateFrom = dateFrom;
    }

    protected get dateFrom():Date {
        return this._dateFrom;
    }

    protected set dateTo(dateTo:Date) {
        this._dateTo = dateTo;
    }

    protected get dateTo():Date {
        return this._dateTo;
    }



}


