import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForBand', function () {
	it('should return style object for value', function () {
		const styleDefinition = {
			bandIndex: 0,
			values: {
				0: {
					color: '#aaaaaa',
				},
				1: {
					color: '#ffffff',
				},
			},
		};

		const value = 1;

		const output = style.getStyleObjectForBand(styleDefinition, value);
		const expectedOutput = {
			color: '#ffffff',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if value not found in definition', function () {
		const styleDefinition = {
			bandIndex: 0,
			values: {
				0: {
					color: '#aaaaaa',
				},
				1: {
					color: '#ffffff',
				},
			},
		};

		const value = 2;

		const output = style.getStyleObjectForBand(styleDefinition, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if there is unknown rule in definition', function () {
		const styleDefinition = {
			bandIndex: 0,
			xxx: {
				0: {
					color: '#aaaaaa',
				},
				1: {
					color: '#ffffff',
				},
			},
		};

		const value = 1;

		const output = style.getStyleObjectForBand(styleDefinition, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
