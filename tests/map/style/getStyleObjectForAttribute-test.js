import {describe, it} from 'mocha';
import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForAttribute', function () {
	const attributes = {
		a: 1,
		b: 'a',
		c: true,
	};

	it('should return style object for attribute', function () {
		const styleDefinition = {
			attributeKey: 'a',
			attributeValues: {
				0: {
					fill: '#aaaaaa',
				},
				1: {
					fill: '#ffffff',
				},
			},
		};

		const output = style.getStyleObjectForAttribute(
			styleDefinition,
			attributes
		);
		const expectedOutput = {
			fill: '#ffffff',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should apply transformations for intervals', function () {
		const attributes2 = {
			a: -3,
		};

		const styleDefinition = {
			attributeKey: 'a',
			attributeTransformations: ['abs'],
			attributeClasses: [
				{
					interval: [2, 4],
					fill: '#ffffff',
				},
			],
		};

		const output = style.getStyleObjectForAttribute(
			styleDefinition,
			attributes2
		);
		const expectedOutput = {
			interval: [2, 4],
			fill: '#ffffff',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if value not found in definition', function () {
		const styleDefinition = {
			attributeKey: 'a',
			attributeValues: {
				0: {
					fill: '#aaaaaa',
				},
				2: {
					fill: '#ffffff',
				},
			},
		};

		const output = style.getStyleObjectForAttribute(
			styleDefinition,
			attributes
		);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if there is unknown rule in definition', function () {
		const styleDefinition = {
			attributeKey: 'a',
			xxx: {
				0: {
					fill: '#aaaaaa',
				},
				1: {
					fill: '#ffffff',
				},
			},
		};

		const output = style.getStyleObjectForAttribute(
			styleDefinition,
			attributes
		);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if there is no attribute fits the definition', function () {
		const styleDefinition = {
			attributeKey: 'xxx',
			attributeValues: {
				0: {
					fill: '#aaaaaa',
				},
				1: {
					fill: '#ffffff',
				},
			},
		};

		const output = style.getStyleObjectForAttribute(
			styleDefinition,
			attributes
		);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
