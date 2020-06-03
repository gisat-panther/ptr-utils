import {assert} from 'chai';
import math from '../src/math';

describe('math', function () {
	describe('countDecimals', function () {
		const tests = [
			{
				name: '0 decimals',
				value: 0,
				expectedResult: 0,
			},
			{
				name: '1 decimal',
				value: 3.2,
				expectedResult: 1,
			},
			{
				name: '5 decimals',
				value: 3.23971,
				expectedResult: 5,
			},
		];

		tests.forEach((test) => {
			it(test.name, function () {
				assert.strictEqual(
					math.countDecimals(test.value),
					test.expectedResult
				);
			});
		});
	});

	describe('round', function () {
		const tests = [
			{
				name: 'integer to 0 decimals',
				number: 3,
				decimals: 0,
				expectedResult: 3,
			},
			{
				name: 'integer to 5 decimals',
				number: 3,
				decimals: 0,
				expectedResult: 3,
			},
			{
				name: 'number to 2 decimals (round down)',
				number: 3.252,
				decimals: 2,
				expectedResult: 3.25,
			},
			{
				name: 'number to 2 decimals (round up)',
				number: 3.257,
				decimals: 2,
				expectedResult: 3.26,
			},
			{
				name: 'number to 2 decimals (round half up)',
				number: 3.255,
				decimals: 2,
				expectedResult: 3.26,
			},
		];

		tests.forEach((test) => {
			it(test.name, function () {
				assert.strictEqual(
					math.round(test.number, test.decimals),
					test.expectedResult
				);
			});
		});
	});

	describe('roundHigher', function () {
		const tests = [
			{
				name: 'integer to 0 decimals',
				number: 3,
				decimals: 0,
				expectedResult: 3,
			},
			{
				name: 'integer to 5 decimals',
				number: 3,
				decimals: 0,
				expectedResult: 3,
			},
			{
				name: 'number to 2 decimals (round down)',
				number: 3.252,
				decimals: 2,
				expectedResult: 3.26,
			},
			{
				name: 'number to 2 decimals (round up)',
				number: 3.257,
				decimals: 2,
				expectedResult: 3.27,
			},
			{
				name: 'number to 2 decimals (round half up)',
				number: 3.255,
				decimals: 2,
				expectedResult: 3.27,
			},
		];

		tests.forEach((test) => {
			it(test.name, function () {
				assert.strictEqual(
					math.roundHigher(test.number, test.decimals),
					test.expectedResult
				);
			});
		});
	});
});
