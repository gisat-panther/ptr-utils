import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForValues', function () {
	const valuesDefinition = {
		a: {
			fill: '#ffffff',
		},
		b: {
			fill: '#000000',
		},
	};

	it('should return style object', function () {
		const value = 'a';
		const output = style.getStyleObjectForValues(valuesDefinition, value);
		const expectedOutput = {
			fill: '#ffffff',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object if no style for given value', function () {
		const value = 'c';
		const output = style.getStyleObjectForValues(valuesDefinition, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
