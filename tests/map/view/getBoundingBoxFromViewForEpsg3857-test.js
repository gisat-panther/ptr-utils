import {assert} from 'chai';
import view from '../../../src/map/view';

describe('getBoundingBoxFromViewForEpsg3857', function () {
	// Expected values calculated here https://epsg.io/transform#s_srs=3857&t_srs=4326

	it('returns expected bounding box in coordinates origin', function () {
		// given params
		const center = {lat: 0, lon: 0};
		const boxRange = 100000; // 100 km
		const viewportRatio = 1;

		// expected output params
		const expectedMinLon = -0.4491576;
		const expectedMaxLon = 0.4491576;
		const expectedMinLat = -0.449153;
		const expectedMaxLat = 0.449153;

		// no optLat given
		const output = view.getBoundingBoxFromViewForEpsg3857(
			center,
			boxRange,
			viewportRatio
		);

		assert.approximately(output.minLat, expectedMinLat, 5e-7);
		assert.approximately(output.minLon, expectedMinLon, 5e-7);
		assert.approximately(output.maxLat, expectedMaxLat, 5e-7);
		assert.approximately(output.maxLon, expectedMaxLon, 5e-7);
	});

	it('returns expected bounding box around Prague', function () {
		// given params
		const center = {lat: 50, lon: 15};
		const center3857 = {x: 1669792.36, y: 6446275.84};

		const boxRange = 20000;
		const viewportRatio = 2; // approx. 20 x 40 km

		// expected output params
		const expectedMinLon = 14.8203369;
		const expectedMaxLon = 15.179663;
		const expectedMinLat = 49.9422227;
		const expectedMaxLat = 50.0577079;

		// no optLat given
		const output = view.getBoundingBoxFromViewForEpsg3857(
			center,
			boxRange,
			viewportRatio
		);

		assert.approximately(output.minLat, expectedMinLat, 5e-7);
		assert.approximately(output.minLon, expectedMinLon, 5e-7);
		assert.approximately(output.maxLat, expectedMaxLat, 5e-7);
		assert.approximately(output.maxLon, expectedMaxLon, 5e-7);
	});
});
