import {assert} from 'chai';
import style from '../../../src/map/style';

describe('getStyleObjectForRaster', function () {
	const styleDef = {
		rules: [
			{
				styles: [
					{
						color: '#000000',
					},
					{
						bandIndex: 0,
						values: {
							0: {
								color: '#aaaaaa',
							},
							1: {
								color: '#ffffff',
							},
						},
					},
					{
						bandIndex: 1,
						values: {
							2: {
								color: '#ff0000',
							},
						},
					},
				],
			},
		],
	};

	const bands = [0, 2];

	it('should return style object for raster', function () {
		const output = style.getStyleObjectForRaster(bands, styleDef);
		const expectedOutput = {
			color: '#ff0000',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return style object for raster 2', function () {
		const bands = [0];
		const output = style.getStyleObjectForRaster(bands, styleDef);
		const expectedOutput = {
			color: '#aaaaaa',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return style object for raster 3', function () {
		const bands = [100];
		const output = style.getStyleObjectForRaster(bands, styleDef);
		const expectedOutput = {
			color: '#000000',
		};

		assert.deepStrictEqual(output, expectedOutput);
	});

	it('should return empty object, if there is no style definition', function () {
		const bands = [1];
		const output = style.getStyleObjectForRaster(bands, null);
		const expectedOutput = {};

		assert.deepStrictEqual(output, expectedOutput);
	});
});
