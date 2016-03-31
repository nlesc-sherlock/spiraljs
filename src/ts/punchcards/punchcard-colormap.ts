

type ColorTableItem = {
    at   : number;
    color: [number, number, number];
}

type ColorTable = Array<ColorTableItem>;


class PunchcardColorMap {

    private _colortable: ColorTable;
    private _cLimLow: number;
    private _cLimHigh: number;

    static defaultColorTable:ColorTable = [
        {
            at: Number.NEGATIVE_INFINITY,
            color: [255, 255, 255, 255]
        },
        {
            at: 0.0,
            color: [8, 106, 227, 0]
        },
        {
            at: 1.0,
            color: [227, 8, 88, 0]
        },
        {
            at: Number.POSITIVE_INFINITY,
            color: [255, 255, 255, 255]
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
        this.cLimLow = this.colortable[1].at;
        this.cLimHigh = this.colortable[nColors - 2].at;

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
                colortable = PunchcardColorMap.defaultColorTable;
                break;
            }
            case 'gray': {
                colortable = [
                    {
                        at: Number.NEGATIVE_INFINITY,
                        color: [0, 0, 0, 255]
                    },
                    {
                        at: 0.0,
                        color: [0, 0, 0, 0]
                    },
                    {
                        at: 1.0,
                        color: [255, 255, 255, 0]
                    },
                    {
                        at: Number.POSITIVE_INFINITY,
                        color: [255, 255, 255, 255]
                    }
                ];
                break;
            }
            case 'empty': {
                colortable = [
                    {
                        at: Number.NEGATIVE_INFINITY,
                        color: [0, 0, 0, 255]
                    },
                    {
                        at: Number.POSITIVE_INFINITY,
                        color: [255, 255, 255, 255]
                    }
                ];
                break;
            }
            case 'autumn': {
                colortable = [
                    {
                        at: Number.NEGATIVE_INFINITY,
                        color: [0, 0, 0, 255]
                    },
                    {
                        at: 0.0,
                        color: [255, 0, 0, 0]
                    },
                    {
                        at: 1.0,
                        color: [255, 255, 0, 0]
                    },
                    {
                        at: Number.POSITIVE_INFINITY,
                        color: [255, 255, 255, 255]
                    }
                ];
                break;
            }
            case 'blues': {
                colortable = [
                    {
                        at: Number.NEGATIVE_INFINITY,
                        color: [0, 0, 0, 255]
                    },
                    {
                        at: 0.0,
                        color: [0, 0, 255, 0]
                    },
                    {
                        at: 1.0,
                        color: [0, 255, 255, 0]
                    },
                    {
                        at: Number.POSITIVE_INFINITY,
                        color: [255, 255, 255, 255]
                    }
                ];
                break;
            }
            case 'summer': {
                colortable = [
                    {
                        at: Number.NEGATIVE_INFINITY,
                        color: [0, 0, 0, 255]
                    },
                    {
                        at: 0.0,
                        color: [8, 160, 120, 0]
                    },
                    {
                        at: 1.0,
                        color: [252, 252, 42, 0]
                    },
                    {
                        at: Number.POSITIVE_INFINITY,
                        color: [255, 255, 255, 255]
                    }
                ];
                break;
            }
            case 'rainbow': {
                colortable = [
                    {
                        at:Number.NEGATIVE_INFINITY,
                        color: [255, 255,   0,  0]
                    },
                    {
                        at:0.000,
                        color: [255, 255,   0,  0]
                    },
                    {
                        at:0.125,
                        color: [255, 255,   0,  0]
                    },
                    {
                        at:0.250,
                        color: [145, 255,   0,  0]
                    },
                    {
                        at:0.375,
                        color: [  0, 255,  54,  0]
                    },
                    {
                        at:0.500,
                        color: [  0, 179, 255,  0]
                    },
                    {
                        at:0.625,
                        color: [ 10,   0, 255,  0]
                    },
                    {
                        at:0.750,
                        color: [171,   0, 255,  0]
                    },
                    {
                        at:0.875,
                        color: [255,   0, 159,  0]
                    },
                    {
                        at:1.000,
                        color: [255,  89,   0,  0]
                    },
                    {
                        at:Number.POSITIVE_INFINITY,
                        color: [255,  89,   0,  0]
                    }
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

        // if there is only one value in the range, lower the lower limit and raise the upper limit
        if (this.cLimLow === this.cLimHigh) {
            this.cLimLow -= 0.5;
            this.cLimHigh += 0.5;
        }

        let atUnity = (at - this.cLimLow) / (this.cLimHigh - this.cLimLow);
        let nColors = this.colortable.length;

        let prev;
        let next;

        for (let iColor = 0; iColor < nColors; iColor++) {
            let cond1 = this.colortable[iColor].at <= atUnity;
            let cond2 = atUnity < this.colortable[iColor + 1].at;
            if (cond1 && cond2) {
                prev = this.colortable[iColor];
                next = this.colortable[iColor + 1];
                break;
            }
        }

        let atRelative:number = (atUnity - prev.at) / (next.at - prev.at);
        let theColor: [number, number, number, number] = [
            Math.floor(prev.color[0] + (next.color[0] - prev.color[0]) * atRelative),
            Math.floor(prev.color[1] + (next.color[1] - prev.color[1]) * atRelative),
            Math.floor(prev.color[2] + (next.color[2] - prev.color[2]) * atRelative),
            255
        ];

        for (let channel of theColor) {
            if (channel < 0 || channel > 255) {
                throw new Error('Calculated color out of bounds.');
            }
        }

        return theColor;
    }




    public getColorRGB(at:number):string {

        let color:[number, number, number];
        color = this.getColor(at);
        return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    }




    public addColor(color: ColorTableItem): PunchcardColorMap {

        this.colortable.push(color);
        this.colortable = this.colortable.sort(this.compare);

        return this;
    }

    public addColors(colors:ColorTable): PunchcardColorMap {

        for (let elem of colors) {
            this.colortable.push(elem);
        }
        this.colortable = this.colortable.sort(this.compare);

        return this;
    }




    public set cLimLow(cLimLow:number) {
        this._cLimLow = cLimLow;
    }

    public get cLimLow() {
        return this._cLimLow;
    }

    public set cLimHigh(cLimHigh:number) {
        this._cLimHigh = cLimHigh;
    }

    public get cLimHigh() {
        return this._cLimHigh;
    }

    public set colortable(colortable:ColorTable) {

        // TODO check if the colortable has colors at Infinity, at 0.0, at 1.0
        // check that the colors are rgba
        // check that infinity has 255 as alpha value on both sides
        this._colortable = colortable;
    }

    public get colortable():ColorTable{
        return this._colortable;
    }


}