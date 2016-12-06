
/**
 * Complex number class
 */
export class Complex {

    static exp(a: Complex): Complex {
        let s: number = Math.exp(a.real);
        return new Complex(s * Math.cos(a.imag), s * Math.sin(a.imag));
    }

    static expi(a: number): Complex {
        return new Complex(Math.cos(a), Math.sin(a));
    }

    constructor (public real: number, public imag: number) {}

    // the complex conjugate: (a + ib) -> (a - ib)
    get conjugate(): Complex {
        return new Complex(this.real, -this.imag);
    }

    // the square function: (a + ib) -> a^2 - b^2
    public square(): number {
        return this.real * this.real - this.imag * this.imag;
    }

    // the length square: (a + ib) -> a^2 + b^2
    public norm2(): number {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    // inverse number: x -> y such that x*y == 1
    public inverse(): Complex {
        let s: number = this.norm2();
        return new Complex(this.real / s, -this.imag / s);
    }

    // complex multiplication: (a + ib) * (c + id) -> (a*c - b*d + i(a*d + b*c))
    public times(a: Complex): Complex {
        return new Complex(
            this.real * a.real - this.imag * a.imag,
            this.imag * a.real + this.real * a.imag
        );
    }

    // multiply by real number
    public times_real(a: number): Complex {
        return new Complex(this.real * a, this.imag * a);
    }

    // complex addition: (a + ib) + (c + id) -> (a+c + i(b+d))
    public plus(a: Complex): Complex {
        return new Complex(
            this.real + a.real, this.imag + a.imag
        );
    }

    // complex subtraction
    public minus(a: Complex): Complex {
        return new Complex(
            this.real - a.real, this.imag - a.imag
        );
    }
}


