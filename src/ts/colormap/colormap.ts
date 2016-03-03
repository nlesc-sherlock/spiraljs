

interface ColorTableItem {
    at   : number;
    color: [number, number, number];
}

interface ColorTable extends Array<ColorTableItem> {};


class ColorMap {

    private _colortable: ColorTable;
    private _cLimLow: number;
    private _cLimHigh: number;

    static defaultColorTable:ColorTable = [
        {
            at: -Infinity,
            color: [255, 255, 255]
        },
        {
            at: 0.0,
            color: [255, 0, 0]
        },
        {
            at: 50,
            color: [0, 128, 0]
        },
        {
            at: 100,
            color: [0, 0, 255]
        }
    ];


    constructor (colortable?:ColorTable|string) {

        let str: string;
        let ct : ColorTable;

        if (typeof colortable === 'undefined') {

            str = 'default';
            ct = this.expandColorTableStr(str);

        } else if (typeof colortable === 'string') {

            str = undefined;
            ct = this.expandColorTableStr(colortable);

        } else if (typeof colortable === 'ColorTable') {

            str = undefined;
            ct = colortable;
        }

        // use my own compare function to sort the array based on the value of
        // each element's 'at' property:
        this.colortable = ct.sort(this.compare);

        // adjust the color limits
        let nColors = this.colortable.length;
        this.cLimLow = this.colortable[0].at;
        this.cLimHigh = this.colortable[nColors - 1].at;

    }



    private compare(a:ColorTableItem, b:ColorTableItem):number {

        if (a.at < b.at) {
            return -1;
        } else if (a.at > b.at) {
            return 1;
        } else {
            return 0;
        }
    }



    protected expandColorTableStr(str) {

        let colortable:ColorTable;

        switch (str) {
            case 'default': {
                colortable = ColorMap.defaultColorTable;
                break;
            }
            case 'gray': {
                colortable = [
                    {
                        at: -Infinity,
                        color: [0, 0, 0]
                    },
                    {
                        at: 0.0,
                        color: [0, 0, 0]
                    },
                    {
                        at: 1.0,
                        color: [255, 255, 255]
                    },
                ];
                break;
            }
            default: {
                throw new Error('ColorMap.expandColorTableStr(): unknown case');
            }
        }

        return colortable;

    }




    public getColor(at:number):[number, number, number] {


        // FIXME currently just uses two indexes from the default colortable

        let iColorPrev:number = 1;
        let iColorNext:number = 2;

        let prevColor: [number, number, number] = this.colortable[iColorPrev].color;
        let prevAt:number = this.colortable[iColorPrev].at;

        let nextColor: [number, number, number] = this.colortable[iColorNext].color;
        let nextAt: number = this.colortable[iColorNext].at;

        let atRelative:number = (at - prevAt) / (nextAt - prevAt);

        let theColor: [number, number, number] = [
            Math.floor(prevColor[0] + (nextColor[0] - prevColor[0]) * atRelative),
            Math.floor(prevColor[1] + (nextColor[1] - prevColor[1]) * atRelative),
            Math.floor(prevColor[2] + (nextColor[2] - prevColor[2]) * atRelative)
        ];

        return theColor;
    }



    public getColorRGB(at:number):string {

        let color:[number, number, number];
        color = this.getColor(at);
        return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
}

    protected set cLimLow(cLimLow:number) {
        this._cLimLow = cLimLow;
    }

    protected get cLimLow() {
        return this._cLimLow;
    }

    protected set cLimHigh(cLimHigh:number) {
        this._cLimHigh = cLimHigh;
    }

    protected get cLimHigh() {
        return this._cLimHigh;
    }

    private set colortable(colortable:ColorTable) {
        this._colortable = colortable;
    }

    private get colortable():ColorTable{
        return this._colortable;
    }


}