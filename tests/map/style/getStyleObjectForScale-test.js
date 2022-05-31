import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForScale', function () {
	const scale = {
		outlineWidth: {
			inputTransformation: ['abs'],
			inputInterval: [-5, 5],
			outputInterval: [0, 1],
		},
	};

	it('should return style object', function () {
		const value = -2.5;
		const output = style.getStyleObjectForScale(scale, value);
		const expectedOutput = {
			outlineWidth: 0.75,
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return style object 2', function () {
		const scale = {
			color: {
				inputInterval: [1, 10],
				outputInterval: ['#ffff00', '#ffff09'],
			},
		};
		const value = 2;
		const output = style.getStyleObjectForScale(scale, value);
		const expectedOutput = {
			color: '#ffff01',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object if given value is out of input interval', function () {
		const value = -6;
		const output = style.getStyleObjectForScale(scale, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object if there is no definition for parameter', function () {
		const value = 1;
		const scale = {
			xxxParameter: {
				inputTransformation: ['abs'],
				inputInterval: [-5, 5],
				outputInterval: [0, 1],
			},
		};
		const output = style.getStyleObjectForScale(scale, value);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
