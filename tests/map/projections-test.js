import {describe, it} from 'mocha';
import {assert} from 'chai';
import projections, {
	EPSG_3857_PROJECTED_BBOX,
	EPSG_3857_WGS84_BBOX,
} from '../../src/map/projections';

describe('coordinates4326To3857', function () {
	// Expected values calculated here https://epsg.io/transform#s_srs=4326&t_srs=3857

	it('returns an intersection of base meridian with equator', function () {
		const lat = 0;
		const lon = 0;
		const expectedX = 0;
		const expectedY = 0;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.equal(output.x, expectedX);
		assert.equal(output.y, expectedY);
	});

	it('returns a point from southern hemisphere', function () {
		const lat = -45.26;
		const lon = 124.45;
		const expectedX = 13853710.63;
		const expectedY = -5662546.46;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.approximately(output.x, expectedX, 0.005);
		assert.approximately(output.y, expectedY, 0.005);
	});

	it('returns a point from northern hemisphere', function () {
		const lat = 80.26;
		const lon = -179.45;
		const expectedX = -19976282.62;
		const expectedY = 15707570.44;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.approximately(output.x, expectedX, 0.005);
		assert.approximately(output.y, expectedY, 0.005);
	});

	it('returns a point from eastern hemisphere', function () {
		const lat = -33.26;
		const lon = 179.45;
		const expectedX = 19976282.62;
		const expectedY = -3929865.68;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.approximately(output.x, expectedX, 0.005);
		assert.approximately(output.y, expectedY, 0.005);
	});

	it('returns a point from western hemisphere', function () {
		const lat = -33.26;
		const lon = -99.145;
		const expectedX = -11036770.91;
		const expectedY = -3929865.68;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.approximately(output.x, expectedX, 0.005);
		assert.approximately(output.y, expectedY, 0.005);
	});

	it('returns the maximal latitude if given is outside bounds', function () {
		const lat = 88;
		const lon = -99.145;
		const expectedX = -11036770.91;
		const expectedY = EPSG_3857_PROJECTED_BBOX.maxY;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.approximately(output.x, expectedX, 0.005);
		assert.approximately(output.y, expectedY, 0.005);
	});

	it('returns the minimal latitude if given is outside bounds', function () {
		const lat = -88;
		const lon = -99.145;
		const expectedX = -11036770.91;
		const expectedY = EPSG_3857_PROJECTED_BBOX.minY;

		const output = projections.coordinates4326To3857({lat, lon});

		assert.approximately(output.x, expectedX, 0.005);
		assert.approximately(output.y, expectedY, 0.005);
	});
});

describe('coordinates3857To4326', function () {
	// Expected values calculated here https://epsg.io/transform#s_srs=3857&t_srs=4326

	it('returns an intersection of base meridian with equator', function () {
		const x = 0;
		const y = 0;
		const expectedLat = 0;
		const expectedLon = 0;

		const output = projections.coordinates3857To4326({x, y});

		assert.equal(output.lat, expectedLat);
		assert.equal(output.lon, expectedLon);
	});

	it('returns a point from southern hemisphere', function () {
		const x = 12345678.9;
		const y = -12345678.9;
		const expectedLat = -73.5739692;
		const expectedLon = 110.9031205;

		const output = projections.coordinates3857To4326({x, y});

		assert.approximately(output.lat, expectedLat, 5e-7);
		assert.approximately(output.lon, expectedLon, 5e-7);
	});

	it('returns a point from northern hemisphere', function () {
		const x = -12345678.9;
		const y = 12345678.9;
		const expectedLat = 73.5739692;
		const expectedLon = -110.9031205;

		const output = projections.coordinates3857To4326({x, y});

		assert.approximately(output.lat, expectedLat, 5e-7);
		assert.approximately(output.lon, expectedLon, 5e-7);
	});

	it('returns a point from eastern hemisphere', function () {
		const x = 12345678.9;
		const y = 12345678.9;
		const expectedLat = 73.5739692;
		const expectedLon = 110.9031205;

		const output = projections.coordinates3857To4326({x, y});

		assert.approximately(output.lat, expectedLat, 5e-7);
		assert.approximately(output.lon, expectedLon, 5e-7);
	});

	it('returns a point from western hemisphere', function () {
		const x = -12345678.9;
		const y = -12345678.9;
		const expectedLat = -73.5739692;
		const expectedLon = -110.9031205;

		const output = projections.coordinates3857To4326({x, y});

		assert.approximately(output.lat, expectedLat, 5e-7);
		assert.approximately(output.lon, expectedLon, 5e-7);
	});

	it('returns the maximal latitude if given is outside bounds', function () {
		const x = 12345678.9;
		const y = 112345678.9;
		const expectedLat = EPSG_3857_WGS84_BBOX.maxLat;
		const expectedLon = 110.9031205;

		const output = projections.coordinates3857To4326({x, y});

		assert.approximately(output.lat, expectedLat, 5e-7);
		assert.approximately(output.lon, expectedLon, 5e-7);
	});

	it('returns the minimal latitude if given is outside bounds', function () {
		const x = -12345678.9;
		const y = -112345678.9;
		const expectedLat = EPSG_3857_WGS84_BBOX.minLat;
		const expectedLon = -110.9031205;

		const output = projections.coordinates3857To4326({x, y});

		assert.approximately(output.lat, expectedLat, 5e-7);
		assert.approximately(output.lon, expectedLon, 5e-7);
	});
});
