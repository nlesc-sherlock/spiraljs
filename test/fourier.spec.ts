import { describe } from 'jasmine';

import { Complex } from '../src/Complex';
import { fft, ifft } from '../src/fourier';

describe('testing infrastructure', () => {
    it('true is true', () =>
        expect(true).toEqual(true));

    it('null is not the same thing as undefined', () =>
        expect(null).not.toEqual(undefined));
});

describe('complex numbers', () => {
    const z1: Complex = new Complex(6, 7);

    it('get real part', () =>
        expect(z1.real).toEqual(6));
    it('get imaginary part', () =>
        expect(z1.imag).toEqual(7));

    let z2: Complex = Complex.EXPI(Math.PI);
    it('Euler\'s identity', () => {
        expect(z2.real).toBeCloseTo(-1, 15);
        expect(z2.imag).toBeCloseTo(0, 15);
    });

    let z3: Complex = z2.times(new Complex(0, 1));
    it('complex multiplication', () => {
        expect(z3.real).toBeCloseTo(0, 15);
        expect(z3.imag).toBeCloseTo(-1, 15);
    });
});

describe('fourier transforms', () => {
    const a = _.range(256).map(
        (a) => new Complex(Math.random(), Math.random()));
    const b = fft(a);
    const c = ifft(b);

    it('inverse of forward transform equals original.', () => {
        for (var i = 0; i < 256; i++) {
            expect(a[i].real).toBeCloseTo(c[i].real, 15);
            expect(a[i].imag).toBeCloseTo(c[i].imag, 15);
        }
    });

    let d = _.range(256).map((a) => new complex(Math.random(), 0.0));
    let e = FFT.fft(d);

    it('symmetry of fourier transform of real valued array.', () => {
        for (var i = 1; i < 128; i++) {
            expect(e[i].real).toBeCloseTo(e[256 - i].real, 12);
            expect(e[i].imag).toBeCloseTo(-e[256 - i].imag, 12);
        }
    });
});
