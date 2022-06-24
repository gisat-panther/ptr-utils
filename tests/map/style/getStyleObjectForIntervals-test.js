import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForIntervals', function () {
	const attributeTransformations = ['abs'];
	const intervals = [
		{
			interval: [0, 1],
			intervalBounds: [false, false],
			outlineWidth: 1,
		},
		{
			interval: [1, 2],
			outlineWidth: 2,
		},
		{
			interval: [2, 3],
			outlineWidth: 3,
		},
		{
			interval: [2, 3],
			outlineWidth: 3,
		},
	];

	it('should return style object', function () {
		const value = 1.5;
		const output = style.getStyleObjectForIntervals(intervals, value);
		const expectedOutput = {
			interval: [1, 2],
			outlineWidth: 2,
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return style object 2', function () {
		const value = 1;
		const output = style.getStyleObjectForIntervals(intervals, value);
		const expectedOutput = {
			interval: [1, 2],
			outlineWidth: 2,
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should apply transformations', function () {
		const value = -2.5;
		const output = style.getStyleObjectForIntervals(
			intervals,
			value,
			attributeTransformations
		);
		const expectedOutput = {
			interval: [2, 3],
			outlineWidth: 3,
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object', function () {
		const value = 0;
		const output = style.getStyleObjectForIntervals(intervals, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object', function () {
		const value = 3;
		const output = style.getStyleObjectForIntervals(intervals, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
