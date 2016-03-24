/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="./d3-punchcard-base.ts" />



class D3PunchcardWeekday extends D3PunchcardBase {

    private _dayOfWeekScale: any;
    private _xFrom         : number;
    private _xTo           : number;


    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.marginLeft = 120;
        this.marginRight = 80;
        this.marginTop = 60;
        this.marginBottom = 100;
        this.xlabel = 'Day of week';
        this.title = 'D3PunchcardWeekday title';

    }




    // define the crossfilter dimensions as used by this class
    public defineDimensions():D3PunchcardWeekday {

        // based on example from
        // http://stackoverflow.com/questions/16766986/is-it-possible-to-group-by-multiple-dimensions-in-crossfilter

        this.dim.weekdayAndHourOfDay = this.cf.dimension(function (d) {
            //stringify() and later, parse() to get keyed objects
            return JSON.stringify({
                weekday: d.moment.format('ddd'),
                hourOfDay: d.moment.hour()
            });
        });

        return this;
    }




    // overrides stub method in parent class
    public draw():D3PunchcardWeekday {

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





    private drawHorizontalAxis():D3PunchcardWeekday {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
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
            .scale(this.dayOfWeekScale);

        this.svg.append('g')
            .attr('class', 'horizontal-axis')
            .attr('transform', 'translate(' + dx + ',' + dy + ')' )
            .call(xAxis);

        return this;

    }




    private drawSymbols():D3PunchcardWeekday {

        // capture the this object
        let that:D3PunchcardWeekday = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = {left:1, right: 1, top: 1, bottom: 1}; // pixels
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


        this.colormap = new ColorMap('summer');
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




    private set dayOfWeekScale(dayOfWeekScale:any) {
        this._dayOfWeekScale = dayOfWeekScale;
    }

    private get dayOfWeekScale():any {
        return this._dayOfWeekScale;
    }

    private set xFrom(xFrom:number) {
        this._xFrom = xFrom;
    }

    private get xFrom():number {
        return this._xFrom;
    }

    private set xTo(xTo:number) {
        this._xTo = xTo;
    }

    private get xTo():number {
        return this._xTo;
    }



}


