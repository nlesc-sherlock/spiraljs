/// <reference path="../../../typings/crossfilter/crossfilter.d.ts" />
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="./d3-punchcard-base.ts" />



class D3PunchcardOrdinal extends D3PunchcardBase {

    private _dateScale   : any;
    private _dateFrom    : Date;
    private _dateTo      : Date;
    private _xlabel      : string;


    constructor (cf: any, domElemId: string) {

        super(cf, domElemId);

        this.marginLeft = 120;
        this.marginRight = 80;
        this.marginTop = 60;
        this.marginBottom = 100;
        this.xlabel = 'Date (UTC)';
        this.ylabel = 'Local time of day';
        this.title = 'D3PunchcardBase title';


    }



    // overrides stub method in parent class
    public draw():D3PunchcardOrdinal {

        this.drawSvg();
        this.drawChartBody();
        this.drawHorizontalAxis();
        this.drawHorizontalAxisLabel();
        this.drawVerticalAxis();
        this.drawVerticalAxisLabel();
        this.drawTitle();
        this.drawSymbols();

        return this;
    }





    private drawHorizontalAxis():D3PunchcardOrdinal {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let dx:number = this.marginLeft;
        let dy:number = this.domElem.clientHeight - this.marginBottom;

        this.dateFrom = this.dim.byHour
            .bottom(1)[0]
            .moment
            .clone()
            .startOf('day')
            .utc();

        this.dateTo = this.dim.byHour
            .top(1)[0]
            .moment
            .clone()
            .endOf('day')
            .utc();

        this.dateScale = d3.time.scale.utc()
            .range([0, w])
            .domain([this.dateFrom, this.dateTo]);

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




    private drawHorizontalAxisLabel():D3PunchcardOrdinal {

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft + 0.5 * w;
        let dy:number = this.marginTop + h + 0.5 * this.marginBottom;

        this.svg.append('g')
            .attr('class', 'horizontal-axis-label')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .append('text')
            .text(this.xlabel)
            .attr('class', 'horizontal-axis-label');

        return this;
    }




    private drawSymbols():D3PunchcardOrdinal {

        // capture the this object
        let that:D3PunchcardOrdinal = this;

        let w :number = this.domElem.clientWidth - this.marginLeft - this.marginRight;
        let h :number = this.domElem.clientHeight - this.marginTop - this.marginBottom;
        let dx:number = this.marginLeft;
        let dy:number = this.marginTop + h;
        let symbolMargin = 1.0; // pixels
        let symbolWidth :number = this.dateScale(moment(this.dateFrom).add(1, 'day').toDate()) - symbolMargin;
        let symbolHeight:number = -1 * this.todScale(23.0) - symbolMargin;
        let theData:any = this.dim.byHour.group().order(d3.ascending).reduceCount().top(Infinity);


        this.svg
            .append('g')
            .attr('class', 'symbol')
            .attr('transform', 'translate(' + dx + ',' + dy + ')')
            .selectAll('rect.symbol')
                .data(theData)
                .enter()
                .append('rect')
                    .attr('class', 'symbol')
                    .attr('x', function(d){
                        return that.dateScale(d.key.clone().startOf('day').utc());
                    })
                    .attr('y', function(d){
                        let m1 = d.key.clone().startOf('day');
                        let m2 = d.key.clone();
                        return that.todScale(m2.diff(m1, 'hour', false));
                    })
                    .attr('width', symbolWidth)
                    .attr('height', symbolHeight)
                    .attr('fill', function(d){
                        if (d.value > 50) {
                            return '#F00';
                        } else {
                            return '#080';
                        }
                    });


        return this;

    }

    private set xlabel(xlabel:string) {
        this._xlabel = xlabel;
    }

    private get xlabel():string {
        return this._xlabel;
    }

    private set dateScale(dateScale:any) {
        this._dateScale = dateScale;
    }

    private get dateScale():any {
        return this._dateScale;
    }

    private set dateFrom(dateFrom:Date) {
        this._dateFrom = dateFrom;
    }

    private get dateFrom():Date {
        return this._dateFrom;
    }

    private set dateTo(dateTo:Date) {
        this._dateTo = dateTo;
    }

    private get dateTo():Date {
        return this._dateTo;
    }



}


