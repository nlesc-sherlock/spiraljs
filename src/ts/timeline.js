var Timeline = (function () {
    function Timeline(size, padding, histogram) {
        this.cLimLowColor = [0, 128, 255];
        this.cLimHighColor = [255, 0, 0];
        this.histogram = histogram;
        this.initializeElements();
        this.drawSvgElem(size);
        this.drawBackground();
        this.drawAxisHorizontal();
        this.drawAxisVertical();
        this.drawHeatmap();
        this.drawLegend();
        this.drawXLabel();
        this.drawYLabel();
        this.drawTitle();
    }
    Timeline.prototype.calcColor = function (cLimLow, cLimHigh, actualValue) {
        var color;
        var iElem;
        var unitValue;
        if (actualValue !== null) {
            color = [null, null, null];
            unitValue = (actualValue - cLimLow) / (cLimHigh - cLimLow);
            for (iElem = 0; iElem < 3; iElem += 1) {
                color[iElem] = this.cLimLowColor[iElem] + (this.cLimHighColor[iElem] - this.cLimLowColor[iElem]) * unitValue;
            }
            return 'rgba(' + Math.floor(color[0]) + ',' +
                Math.floor(color[1]) + ',' +
                Math.floor(color[2]) + ', 255)';
        }
        else {
            return 'rgba(0,0,0,0)';
        }
    };
    Timeline.prototype.drawAxisHorizontal = function () {
        this.dateScale = d3.time.scale()
            .domain([this.histogram.xDomainFrom, this.histogram.xDomainTo])
            .range([0, this.elements.chart.size.width]);
        var dateAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.dateScale)
            .ticks(5);
        this.elements.chart.elem
            .append('g')
            .attr('class', 'dateAxisGroup')
            .attr('transform', 'translate(0,' + this.elements.chart.size.height + ')')
            .call(dateAxis);
    };
    ;
    Timeline.prototype.drawAxisVertical = function () {
        this.todScale = d3.scale.linear()
            .domain([this.histogram.yDomainFrom, this.histogram.yDomainTo])
            .range([0, this.elements.chart.size.height]);
        var todAxis = d3.svg.axis()
            .orient('left')
            .scale(this.todScale);
        this.elements.chart.elem
            .append('g')
            .attr('class', 'todAxisGroup')
            .attr('transform', 'translate(0,0)')
            .call(todAxis);
    };
    ;
    Timeline.prototype.drawBackground = function () {
        var translation = {
            left: this.elements.svg.padding.left,
            down: this.elements.svg.padding.top
        };
        var size = {
            width: this.elements.svg.size.width -
                this.elements.svg.padding.left -
                this.elements.svg.padding.right,
            height: this.elements.svg.size.height -
                this.elements.svg.padding.top -
                this.elements.svg.padding.bottom
        };
        var padding = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };
        var elem = this.elements.svg.elem
            .append('g')
            .attr('class', 'chart');
        elem.attr('transform', 'translate(' + translation.left + ',' + translation.down + ')');
        elem.append('rect')
            .attr('width', size.width)
            .attr('height', size.height)
            .attr('class', 'background');
        this.elements.chart = {
            elem: elem,
            translation: translation,
            size: size,
            padding: padding
        };
    };
    Timeline.prototype.drawHeatmap = function () {
        var heatmap = this.elements.chart.elem
            .append('g').attr('class', 'heatmap');
        var that = this;
        heatmap.selectAll('rect').data(this.histogram.countData).enter().append('rect')
            .attr('x', function (d) { return that.dateScale(d.dateFrom); })
            .attr('y', function (d) { return that.todScale(d.todFrom); })
            .attr('width', function () { return that.elements.chart.size.width / that.histogram.xDomainExtent; })
            .attr('height', function () { return that.elements.chart.size.height / that.histogram.yDomainExtent; })
            .attr('fill', function (d) { return that.calcColor(that.histogram.min, that.histogram.max, d.count); })
            .attr('class', 'histogram');
        heatmap.selectAll('rect.histogram')
            .on('click', function (d) { console.log(d); });
    };
    Timeline.prototype.drawLegend = function () {
        var that = this;
        var left = this.elements.chart.size.width + 0.5 * this.elements.chart.padding.right;
        var top = 0.6 * this.elements.chart.size.height;
        this.elements.chart.elem
            .append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (left) + ',' + top + ')');
        this.elements.chart.elem.select('g.legend')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 20)
            .attr('class', 'legend-min')
            .attr('fill', function (d) {
            return that.calcColor(that.histogram.min, that.histogram.max, that.histogram.min);
        });
        this.elements.chart.elem.select('g.legend')
            .append('text')
            .attr('x', 30)
            .attr('y', 15)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'baseline')
            .attr('class', 'legend-min')
            .text('min: ' + this.histogram.min);
        this.elements.chart.elem.select('g.legend')
            .append('rect')
            .attr('x', 0)
            .attr('y', 30)
            .attr('width', 20)
            .attr('height', 20)
            .attr('class', 'legend-max')
            .attr('fill', function (d) {
            return that.calcColor(that.histogram.min, that.histogram.max, that.histogram.max);
        });
        this.elements.chart.elem.select('g.legend')
            .append('text')
            .attr('x', 30)
            .attr('y', 45)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'baseline')
            .attr('class', 'legend-max')
            .text('max: ' + this.histogram.max);
    };
    Timeline.prototype.drawSvgElem = function (size) {
        var elem = d3.select('#timeline')
            .append('svg')
            .attr('class', 'svg')
            .attr('width', size.width)
            .attr('height', size.height);
        var translation = { left: 0, down: 0 };
        var padding = { top: 30, right: 100, bottom: 100, left: 100 };
        this.elements.svg = {
            elem: elem,
            translation: translation,
            size: size,
            padding: padding
        };
    };
    Timeline.prototype.drawTitle = function () {
        var left = this.elements.chart.size.width / 2;
        var top = -this.elements.svg.padding.top / 2;
        this.elements.chart.elem
            .append('g')
            .attr('class', 'title')
            .attr('transform', 'translate(' + left + ', ' + top + ')')
            .append('text')
            .text('Number of records: ' + this.histogram.numberOfRecords)
            .attr('text-anchor', 'middle');
    };
    Timeline.prototype.drawXLabel = function () {
        var left = this.elements.chart.size.width / 2;
        var top = this.elements.chart.size.height + this.elements.svg.padding.bottom / 2;
        this.elements.chart.elem
            .append('g')
            .attr('class', 'xlabel')
            .attr('transform', 'translate(' + left + ', ' + top + ')')
            .append('text')
            .text('date')
            .attr('text-anchor', 'middle');
    };
    Timeline.prototype.drawYLabel = function () {
        var left = this.elements.svg.padding.left / 2;
        var top = this.elements.chart.size.height / 2;
        this.elements.chart.elem
            .append('g')
            .attr('class', 'ylabel')
            .attr('transform', 'translate(' + (-left) + ', ' + top + ') rotate(-90)')
            .append('text')
            .text('time of day')
            .attr('text-anchor', 'middle');
    };
    Timeline.prototype.initializeElements = function () {
        this.elements = {
            svg: null,
            chart: null
        };
    };
    Object.defineProperty(Timeline.prototype, "chartGroup", {
        get: function () {
            return this._chartGroup;
        },
        set: function (chartGroup) {
            this._chartGroup = chartGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "cLimHighColor", {
        get: function () {
            return this._cLimHighColor;
        },
        set: function (cLimHighColor) {
            this._cLimHighColor = cLimHighColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "cLimLowColor", {
        get: function () {
            return this._cLimLowColor;
        },
        set: function (cLimLowColor) {
            this._cLimLowColor = cLimLowColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "dateScale", {
        get: function () {
            return this._dateScale;
        },
        set: function (dateScale) {
            this._dateScale = dateScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        set: function (elements) {
            this._elements = elements;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "histogram", {
        get: function () {
            return this._histogram;
        },
        set: function (histogram) {
            this._histogram = histogram;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timeline.prototype, "todScale", {
        get: function () {
            return this._todScale;
        },
        set: function (todScale) {
            this._todScale = todScale;
        },
        enumerable: true,
        configurable: true
    });
    return Timeline;
})();
