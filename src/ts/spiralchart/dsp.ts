/**
 * DSP module.
 *
 * Contains functionality to do digital signal processing on
 * the time series that we try to visualise. In particular we experiment
 * using the Fourier domain to guide the user to possible areas of interest.
 */

/**
 * Complex number arithmetic
 */
module Complex {
    /**
     * Complex number class
     */
    export class Complex {
        constructor (public real: number, public imag: number) {}

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
         * @returns complex multiple: (a + ib) * (c + id) -> (a c - b d + i(a d + b c))
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

    /**
     * @param a complex number
     * @returns exp(a + ib) -> exp(a) (cos(b) + i sin(b))
     */
    export function exp(a: Complex): Complex {
        let s: number = Math.exp(a.real);
        return new Complex(s * Math.cos(a.imag), s * Math.sin(a.imag));
    }

    /**
     * @param a real number
     * @returns exp(ia)
     */
    export function expi(a: number): Complex {
        return new Complex(Math.cos(a), Math.sin(a));
    }
}

/**
 * The RFFT or Rather Fast Fourier Transform.
 *
 * This module has the forward as well as inverse transform. See
 * https://en.wikipedia.org/wiki/Discrete_Fourier_transform for more information
 * on the discrete Fourier transform.
 * To answer the question on everyone's mind: the inverse transform is normalised
 * such that it returns the original series (barring round-off errors).
 */
module FFT {
    import complex = Complex.Complex;

    /**
     * Forward Fourier transform (1d). This uses the Cooley–Tukey algorithm
     * in a recursive fashion. This is not an optimal implementation, but it
     * is fast enough for our purposes.
     *
     * @param s list of complex numbers.
     * @returns discrete Fourier sum of the series.
     */
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

    /**
     * Inverse Fourier transform
     *
     * @param s list of complex numbers
     * @returns the inverse discrete Fourier sum of the series.
     */
    export function ifft(s: complex[]): complex[] {
        let y = fft(s.map(z => z.conjugate));
        return y.map(z => z.conjugate.times_real(1.0 / s.length));
    }
}
