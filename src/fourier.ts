import { Complex } from './Complex';

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

export function ifft(s: Complex[]): Complex[] {
    let y = fft(s.map(z => z.conjugate));
    return y.map(z => z.conjugate.times_real(1.0 / s.length));
}

