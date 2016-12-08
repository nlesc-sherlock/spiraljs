/*jslint nomen:true */
/*globals describe, it, spiral, expect, d3, _ */

// import range from 'lodash/range';
// import { Complex } from '../src/Complex';
// import { fft, ifft } from '../src/fourier';

var Complex = spiral.Complex;
var fft = spiral.fft;
var ifft = spiral.ifft;

describe('testing infrastructure', function () {
    it('true is true', function () {
        return expect(true).toEqual(true) });
    it('null is not the same thing as undefined', function () {
        return expect(null).not.toEqual(undefined); });
});

describe('complex numbers', function () {
    var z1;
    var z2;
    beforeEach(function () {
        z1 = new Complex(6, 7);
        z2 = Complex.EXPI(Math.PI);
    });
    it('get real part', function () {
        return expect(z1.real).toEqual(6); });
    it('get imaginary part', function () {
        return expect(z1.imag).toEqual(7); });
    it('Euler\'s identity', function () {
        expect(z2.real).toBeCloseTo(-1, 15);
        expect(z2.imag).toBeCloseTo(0, 15);
    });
    it('complex multiplication', function () {
        const z3 = z2.times(new Complex(0, 1));
        expect(z3.real).toBeCloseTo(0, 15);
        expect(z3.imag).toBeCloseTo(-1, 15);
    });
});

describe('fourier transforms', function () {
    var a;
    beforeEach(function () {
        a = _.range(256).map(function () {
            return new Complex(Math.random(), Math.random()); });
    });
    it('inverse of forward transform equals original.', function () {
        const b = fft(a);
        const c = ifft(b);
        for (var i = 0; i < 256; i += 1) {
            expect(a[i].real).toBeCloseTo(c[i].real, 15);
            expect(a[i].imag).toBeCloseTo(c[i].imag, 15);
        }
    });
    it('symmetry of fourier transform of real valued array.', function () {
        const d = _.range(256).map(function () {
            return new Complex(Math.random(), 0.0); });
        const e = fft(d);
        for (var i = 1; i < 128; i += 1) {
            expect(e[i].real).toBeCloseTo(e[256 - i].real, 12);
            expect(e[i].imag).toBeCloseTo(-e[256 - i].imag, 12);
        }
    });
});
