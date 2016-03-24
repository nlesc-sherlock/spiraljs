/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="./d3-punchcard-base.ts" />



class D3PunchcardDate extends D3PunchcardBase {

    private _dateScale   : any;
    private _dateFrom    : moment.Moment;
    private _dateTo      : moment.Moment;


    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.marginLeft = 120;
        this.marginRight = 80;
        this.marginTop = 60;
        this.marginBottom = 100;
        this.xlabel = 'Date (Local time)';
        this.title = 'D3PunchcardDate title';

    }




    // define the crossfilter dimensions as used by this class
    public defineDimensions():D3PunchcardDate {

        // based on example from
        // http://stackoverflow.com/questions/16766986/is-it-possible-to-group-by-multiple-dimensions-in-crossfilter

        this.dim.dateAndHourOfDay = this.cf.dimension(function (d) {
            //stringify() and later, parse() to get keyed objects
            return JSON.stringify({
                date: d.moment.clone().startOf('day').format('YYYYMMDDTHH:mm:ssZ'),
                hourOfDay: d.moment.hour()
            });
        });

        return this;
    }




    // overrides stub method in parent class
    public draw():D3PunchcardDate {

        super.drawSvg();
        super.drawChartBody();
        this.drawHorizontalAxis();
        super.drawHorizontalAxisLabel();
        super.drawVerticalAxis();
        super.drawVerticalAxisLabel();
        super.drawTitle();
        this.drawSymbols();

        return this;
    }





    private drawHorizontalAxis():D3PunchcardDate {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;

        this.dateFrom = this.dim.dateAndHourOfDay
            .bottom(1)[0]
            .moment
            .clone()
            .startOf('day');

        this.dateTo = this.dim.dateAndHourOfDay
            .top(1)[0]
            .moment
            .clone()
            .endOf('day');

        this.dateScale = d3.time.scale()
            .range([0, w])
            .domain([this.dateFrom.toDate(), this.dateTo.toDate()]);

        let dateAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dateScale)
            .ticks(7);

        this.svg.append('g')
            .attr('class', 'horizontal-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(dateAxis);

        return this;

    }




    private drawSymbols():D3PunchcardDate {

        // capture the this object
        let that:D3PunchcardDate = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = {left:1, right: 1, top: 1, bottom: 1}; // pixels
        let symbolWidth :number = w / this.dateTo.diff(this.dateFrom, 'days') - symbolMargin.left - symbolMargin.right;
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


        this.colormap = new ColorMap('default');
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


        // // draw the rects
        // this.svg
        //     .append('g')
        //     .attr('class', 'symbol')
        //     .attr('transform', 'translate(' + dx + ',' + dy + ')')
        //     .selectAll('rect.symbol')
        //         .data(data)
        //         .enter()
        //         .append('rect')
        //             .attr('class', 'symbol')
        //             .attr('x', function(d){
        //                 return that.dateScale(moment(d.key.date, 'YYYYMMDDTHH:mm:ssZ'));
        //             })
        //             .attr('y', function(d){
        //                 return that.todScale(d.key.hour);
        //             })
        //             .attr('width', symbolWidth)
        //             .attr('height', symbolHeight)
        //             .attr('fill', function(d){
        //                 return that.colormap.getColorRGB(d.value);
        //             });

        return this;

    }




    private set dateScale(dateScale:any) {
        this._dateScale = dateScale;
    }

    private get dateScale():any {
        return this._dateScale;
    }

    private set dateFrom(dateFrom:moment.Moment) {
        this._dateFrom = dateFrom;
    }

    private get dateFrom():moment.Moment {
        return this._dateFrom;
    }

    private set dateTo(dateTo:moment.Moment) {
        this._dateTo = dateTo;
    }

    private get dateTo():moment.Moment {
        return this._dateTo;
    }



}

