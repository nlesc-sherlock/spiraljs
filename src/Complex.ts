/**
 * Complex number class
 */
export class Complex {
    /**
     * @param a complex number
     * @returns exp(a + ib) -> exp(a) (cos(b) + i sin(b))
     */
    static exp(a: Complex): Complex {
        let s: number = Math.exp(a.real);
        return new Complex(s * Math.cos(a.imag), s * Math.sin(a.imag));
    }

    /**
     * @param a real number
     * @returns exp(ia)
     */
    static expi(a: number): Complex {
        return new Complex(Math.cos(a), Math.sin(a));
    }

    public real: number;
    public imag: number;

    constructor (real: number, imag: number) {
        this.real = real;
        this.imag = imag;
    }

    /**
    * @returns the complex conjugate: (a + ib) -> (a - ib)
    */
    get conjugate(): Complex {
        return new Complex(this.real, -this.imag);
    }

    /**
    * @returns the square function: (a + ib) -> a^2 - b^2
    */
    public square(): number {
        return this.real * this.real - this.imag * this.imag;
    }

    /**
    * @returns the length square: (a + ib) -> a^2 + b^2
    */
    public norm2(): number {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    /**
    * @returns inverse number: x -> y such that x y == 1
    */
    public inverse(): Complex {
        let s: number = this.norm2();
        return new Complex(this.real / s, -this.imag / s);
    }

    /**
    * @param a other complex number.
    * @returns complex multiple: (a + ib) * (c + id)
    *    -> (a c - b d + i(a d + b c))
    */
    public times(a: Complex): Complex {
        return new Complex(
            this.real * a.real - this.imag * a.imag,
            this.imag * a.real + this.real * a.imag
        );
    }

    /**
    * @returns multiple by real number: (a + ib) c -> (a c + i b c)
    */
    public times_real(a: number): Complex {
        return new Complex(this.real * a, this.imag * a);
    }

    /**
    * @returns complex sum: (a + ib) + (c + id) -> (a+c + i(b+d))
    */
    public plus(a: Complex): Complex {
        return new Complex(
            this.real + a.real, this.imag + a.imag
        );
    }

    /**
    * @returns complex difference: (a + ib) - (c + id) -> (a-c + i(b-d))
    */
    public minus(a: Complex): Complex {
        return new Complex(
            this.real - a.real, this.imag - a.imag
        );
    }
}
