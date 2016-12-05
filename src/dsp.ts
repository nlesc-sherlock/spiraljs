module Complex {
    /**
     * Complex number class
     */
    export class Complex {
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

    export function exp(a: Complex): Complex {
        let s: number = Math.exp(a.real);
        return new Complex(s * Math.cos(a.imag), s * Math.sin(a.imag));
    }

    export function expi(a: number): Complex {
        return new Complex(Math.cos(a), Math.sin(a));
    }
}

module FFT {
    import complex = Complex.Complex;

    export function fft(s: complex[]): complex[] {
        let N: number = s.length;

        if (N === 1) { return [s[0]]; }

        if (N % 2 !== 0) { throw new Error('FFT: Size of array must be power of 2.'); }

        let r = new Array<complex>(N / 2);
        for (var j = 0; j < N / 2; ++j) {
            r[j] = s[j * 2];
        }
        let p = fft(r);

        for (var j = 0; j < N / 2; ++j) {
            r[j] = s[j * 2 + 1];
        }
        let q = fft(r);

        var y = new Array<complex>(N);
        for (var k = 0; k < N / 2; ++k) {
            let wk = Complex.expi(-2 * k * Math.PI / N);
            let qk = wk.times(q[k]);
            y[k]         = p[k].plus(qk);
            y[k + N / 2] = p[k].minus(qk);
        }

        return y;
    }

    export function ifft(s: complex[]): complex[] {
        let y = fft(s.map(z => z.conjugate));
        return y.map(z => z.conjugate.times_real(1.0 / s.length));
    }
}
