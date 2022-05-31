import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForVector', function () {
	const styleDef = {
		rules: [
			{
				styles: [
					{
						fill: '#000000',
					},
					{
						attributeKey: 'a',
						attributeValues: {
							1: {
								fill: '#aaaaaa',
							},
							2: {
								fill: '#ffffff',
							},
						},
					},
					{
						attributeKey: 'b',
						attributeValues: {
							1: {
								outlineWidth: 2,
							},
						},
					},
				],
			},
		],
	};

	const attributes = {
		a: 1,
		b: 1,
	};

	it('should return style object for vector', function () {
		const output = style.getStyleObjectForVector(attributes, styleDef);
		const expectedOutput = {
			fill: '#aaaaaa',
			outlineWidth: 2,
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return style object for vector 2', function () {
		const attributes = {
			a: 1,
		};
		const output = style.getStyleObjectForVector(attributes, styleDef);
		const expectedOutput = {
			fill: '#aaaaaa',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return style object for vector 3', function () {
		const attributes = {
			xxx: 1,
		};
		const output = style.getStyleObjectForVector(attributes, styleDef);
		const expectedOutput = {
			fill: '#000000',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if there is no style definition', function () {
		const output = style.getStyleObjectForVector(attributes, null);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
