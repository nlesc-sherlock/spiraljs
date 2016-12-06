/** The RFFT or Rather Fast Fourier Transform.
 *
 * This module has the forward as well as inverse transform. See
 * https://en.wikipedia.org/wiki/Discrete_Fourier_transform for more information
 * on the discrete Fourier transform.
 * To answer the question on everyone's mind: the inverse transform is
 * normalised such that it returns the original series (barring round-off
 * errors).
 */

/**
 * class Complex
 */
import { Complex } from './Complex';

/**
 * Forward Fourier transform (1d). This uses the Cooley–Tukey algorithm
 * in a recursive fashion. This is not an optimal implementation, but it
 * is fast enough for our purposes.
 *
 * @param s list of complex numbers.
 * @returns discrete Fourier sum of the series.
 */
export function fft(s: Complex[]): Complex[] {
    let N: number = s.length;

    if (N === 1) { return [s[0]]; }

    if (N % 2 !== 0) { throw new Error('FFT: Size of array must be power of 2.'); }

    let r = new Array<Complex>(N / 2);
    for (var j = 0; j < N / 2; ++j) {
        r[j] = s[j * 2];
    }
    let p = fft(r);

    for (var j = 0; j < N / 2; ++j) {
        r[j] = s[j * 2 + 1];
    }
    let q = fft(r);

    var y = new Array<Complex>(N);
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
export function ifft(s: Complex[]): Complex[] {
    let y = fft(s.map(z => z.conjugate));
    return y.map(z => z.conjugate.times_real(1.0 / s.length));
}
