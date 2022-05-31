import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('hexToRgb', function () {
	it('convert hex code to rgb object', function () {
		const hex = '#ff0009';
		const output = style.hexToRgb(hex);
		const expectedOutput = {r: 255, g: 0, b: 9};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return null, if hex is not color code', function () {
		const hex = '#f0009';
		const output = style.hexToRgb(hex);

		assert.isNull(output);
	});
});
