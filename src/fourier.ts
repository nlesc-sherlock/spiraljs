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
    const N: number = s.length;

    if (N === 1) { return [s[0]]; }

    if (N % 2 !== 0) { throw new Error('FFT: Size of array must be power of 2.'); }

    const r: Complex[] = [];
    r.length = N / 2;
    for (let j = 0; j < N / 2; j += 1) {
        r[j] = s[j * 2];
    }
    const p = fft(r);

    for (let j = 0; j < N / 2; j += 1) {
        r[j] = s[j * 2 + 1];
    }
    const q = fft(r);

    const y: Complex[] = [];
    y.length = N;
    for (let k = 0; k < N / 2; k += 1) {
        const wk = Complex.EXPI(-2 * k * Math.PI / N);
        const qk = wk.times(q[k]);
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
    const y = fft(s.map(z => z.conjugate));
    return y.map(z => z.conjugate.times_real(1.0 / s.length));
}
