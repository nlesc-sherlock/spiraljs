// import { describe, expect, it } from 'jasmine';
import { range } from 'lodash';

import { Complex } from '../src/Complex';
import { fft, ifft } from '../src/fourier';

describe('testing infrastructure', () => {
    it('true is true', () =>
        expect(true).toEqual(true));

    it('null is not the same thing as undefined', () =>
        expect(null).not.toEqual(undefined));
});

describe('complex numbers', () => {
    let z1: Complex;
    let z2: Complex;

    beforeEach(() => {
        z1 = new Complex(6, 7);
        z2 = Complex.EXPI(Math.PI);
    });

    it('get real part', () =>
        expect(z1.real).toEqual(6));
    it('get imaginary part', () =>
        expect(z1.imag).toEqual(7));

    it('Euler\'s identity', () => {
        expect(z2.real).toBeCloseTo(-1, 15);
        expect(z2.imag).toBeCloseTo(0, 15);
    });

    it('complex multiplication', () => {
        const z3: Complex = z2.times(new Complex(0, 1));
        expect(z3.real).toBeCloseTo(0, 15);
        expect(z3.imag).toBeCloseTo(-1, 15);
    });
});

describe('fourier transforms', () => {
    let a: Complex[];
    beforeEach(() => {
        a = range(256).map(() =>
            new Complex(Math.random(), Math.random()));
    });

    it('inverse of forward transform equals original.', () => {
        const b = fft(a);
        const c = ifft(b);

        for (let i = 0; i < 256; i += 1) {
            expect(a[i].real).toBeCloseTo(c[i].real, 15);
            expect(a[i].imag).toBeCloseTo(c[i].imag, 15);
        }
    });

    it('symmetry of fourier transform of real valued array.', () => {
        const d = range(256).map(() => new Complex(Math.random(), 0.0));
        const e = fft(d);

        for (let i = 1; i < 128; i += 1) {
            expect(e[i].real).toBeCloseTo(e[256 - i].real, 12);
            expect(e[i].imag).toBeCloseTo(-e[256 - i].imag, 12);
        }
    });
});
