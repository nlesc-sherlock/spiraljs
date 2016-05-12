/// <reference path="../../typings/main/ambient/node/index.d.ts"/>
/// <reference path="../../typings/main/ambient/jasmine/index.d.ts" />
/// <reference path="../../typings/main/ambient/lodash/index.d.ts" />

/// <reference path="../ts/spiralchart/dsp.ts" />

import complex = Complex.Complex;

if (typeof module !== 'undefined' && module.exports) {
    // we have CommonJS support, load requirements
    var _: _.LoDashStatic = require('lodash');
    require('jasmine');
}

describe('testing infrastructure', () => {
    it('true is true', () =>
        expect(true).toEqual(true));

    it('null is not the same thing as undefined', () =>
        expect(null).not.toEqual(undefined));
});

describe('complex numbers', () => {
	let z1: complex = new complex(6, 7);

	it('get real part', () =>
		expect(z1.real).toEqual(6));
	it('get imaginary part', () =>
		expect(z1.imag).toEqual(7));

	let z2: complex = Complex.expi(Math.PI);
	it('Euler\'s identity', () => {
		expect(z2.real).toBeCloseTo(-1, 15);
		expect(z2.imag).toBeCloseTo(0, 15);
	});

	let z3: complex = z2.times(new complex(0, 1));
	it('complex multiplication', () => {
		expect(z3.real).toBeCloseTo(0, 15);
		expect(z3.imag).toBeCloseTo(-1, 15);
	});
});

describe('fourier transforms', () => {
	let a = _.range(256).map((a) => new complex(Math.random(), Math.random()));
	let b = FFT.fft(a);
	let c = FFT.ifft(b);

	it('inverse of forward transform equals original.', () => {
		for (var i = 0; i < 256; i++) {
			expect(a[i].real).toBeCloseTo(c[i].real, 15);
			expect(a[i].imag).toBeCloseTo(c[i].imag, 15);
		}
	});
});
