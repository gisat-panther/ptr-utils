import {assert} from 'chai';
import {cloneDeep} from 'lodash';
import {mapConstants} from '@gisatcz/ptr-core';

import {
	ensureViewIntegrity,
	mergeViews,
	getViewFromBoundingBox,
	getViewFromGeometry,
	getZoomLevelFromBoxRange,
	getZoomLevelFromPixelSize,
	getMapViewportRange,
	getBoxRangeFromZoomLevel,
	getPixelSizeFromZoomLevel,
	getNearestZoomLevelBoxRange,
} from '../../src/map/view';
import {contrast} from 'chroma-js';

const validView = {
	heading: 0,
	tilt: 0,
	range: 5000,
	center: {
		lon: 14,
		lat: 51,
	},
};

const geometry = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[16, 51],
						[19, 51],
						[19, 52],
						[16, 52],
						[16, 51],
					],
				],
			},
		},
	],
};

describe('ensureViewIntegrity', function () {
	it('view is valid', function () {
		assert.deepEqual(ensureViewIntegrity(cloneDeep(validView)), validView);
	});

	it('fix invalid heading 1', function () {
		const invalidView = cloneDeep(validView);
		invalidView.heading = -30;

		const validViewHeading = cloneDeep(validView);
		validViewHeading.heading = 330;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewHeading);
	});

	it('fix invalid heading 2', function () {
		const invalidView = cloneDeep(validView);
		invalidView.heading = 370;

		const validViewHeading = cloneDeep(validView);
		validViewHeading.heading = 10;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewHeading);
	});

	it('fix invalid tilt 1', function () {
		const invalidView = cloneDeep(validView);
		invalidView.tilt = 100;

		const validViewTilt = cloneDeep(validView);
		validViewTilt.tilt = 90;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewTilt);
	});

	it('fix invalid tilt 2', function () {
		const invalidView = cloneDeep(validView);
		invalidView.tilt = -50;

		const validViewTilt = cloneDeep(validView);
		validViewTilt.tilt = 0;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewTilt);
	});

	it('fix invalid range', function () {
		const invalidView = cloneDeep(validView);
		invalidView.range = -100;

		const validViewRange = cloneDeep(validView);
		validViewRange.range = 0.01;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewRange);
	});

	it('fix invalid center longitude', function () {
		const invalidView = cloneDeep(validView);
		invalidView.center.lon = 400;

		const validViewCenterLon = cloneDeep(validView);
		validViewCenterLon.center.lon = 40;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewCenterLon);
	});

	it('fix invalid center longitude', function () {
		const invalidView = cloneDeep(validView);
		invalidView.center.lon = 180;

		const validViewCenterLon = cloneDeep(validView);
		validViewCenterLon.center.lon = 180;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewCenterLon);
	});

	it('fix invalid center longitude', function () {
		const invalidView = cloneDeep(validView);
		invalidView.center.lon = 181;

		const validViewCenterLon = cloneDeep(validView);
		validViewCenterLon.center.lon = -179;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewCenterLon);
	});

	it('fix invalid center longitude', function () {
		const invalidView = cloneDeep(validView);
		invalidView.center.lon = -400;

		const validViewCenterLon = cloneDeep(validView);
		validViewCenterLon.center.lon = -40;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewCenterLon);
	});

	it('fix invalid center longitude', function () {
		const invalidView = cloneDeep(validView);
		invalidView.center.lon = -180;

		const validViewCenterLon = cloneDeep(validView);
		validViewCenterLon.center.lon = 180;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewCenterLon);
	});

	it('fix invalid center longitude', function () {
		const invalidView = cloneDeep(validView);
		invalidView.center.lon = -181;

		const validViewCenterLon = cloneDeep(validView);
		validViewCenterLon.center.lon = 179;
		assert.deepEqual(ensureViewIntegrity(invalidView), validViewCenterLon);
	});
});

describe('mergeViews', function () {
	it('merge two views', function () {
		const viewOne = {
			a: 1,
		};

		const viewTwo = {
			b: 2,
		};

		assert.deepEqual(mergeViews(viewOne, viewTwo), {a: 1, b: 2});
	});

	it('returns cached result', function () {
		const viewOne = {
			a: 1,
		};

		const viewTwo = {
			b: 2,
		};

		const mergeOne = mergeViews(viewOne, viewTwo);
		const mergeTwo = mergeViews(viewOne, viewTwo);

		assert.equal(mergeOne, mergeTwo);
	});

	it('merge three views', function () {
		const viewOne = {
			a: 1,
		};

		const viewTwo = {
			b: 2,
		};

		const viewThree = {
			c: 3,
		};

		assert.deepEqual(mergeViews(viewOne, viewTwo, viewThree), {
			a: 1,
			b: 2,
			c: 3,
		});
	});
});

describe('getViewFromBoundingBox', function () {
	it('returns bounding box', function () {
		const BBox = getViewFromBoundingBox([10, 10, -10, -10], true);

		assert.deepEqual(BBox.center, {lon: 0, lat: 0});
		assert.deepEqual(BBox.boxRange, 2500000);
	});

	it('returns bounding box', function () {
		const BBox = getViewFromBoundingBox([90, 90, -10, -10]);

		assert.deepEqual(BBox.center, {lon: 40, lat: 40});
		assert.deepEqual(BBox.boxRange, 12500000);
	});

	it('returns bounding box', function () {
		const BBox = getViewFromBoundingBox([90, 90, -10, -10], true);

		assert.deepEqual(BBox.center, {lon: 40, lat: 40});
		assert.deepEqual(BBox.boxRange, 16317591.116653483);
	});
});

describe('getViewFromGeometry', function () {
	it('returns view centered on geometry', function () {
		const view = getViewFromGeometry(geometry, true);

		assert.deepEqual(view, {
			boxRange: 602395.4746276854,
			center: {
				lat: 51.5,
				lon: 17.5,
			},
		});
	});

	it('returns view centered on geometry', function () {
		const view = getViewFromGeometry(geometry);

		assert.deepEqual(view, {
			boxRange: 375000,
			center: {
				lat: 51.5,
				lon: 17.5,
			},
		});
	});
});

describe('getZoomLevelFromBoxRange', function () {
	it('returns worldwind range from boxRange', function () {
		const boxRange = 1000;
		const width = 300; //px
		const height = 600; //px
		const level = getZoomLevelFromBoxRange(boxRange, width, height);

		assert.equal(level, 14);
	});
});

describe('getZoomLevelFromPixelSize', function () {
	const levelsPxSize = mapConstants.pixelSizeInLevels;

	it('Identify level by pixelsize', function () {
		const level = getZoomLevelFromPixelSize(1000000);
		assert.equal(level, 0);
	});

	it('Identify level by pixelsize', function () {
		const level = getZoomLevelFromPixelSize(1);
		assert.equal(level, 16);
	});

	it('return 0 if pixel size is bigger then lowest level', function () {
		const lowestLevelPxSize = levelsPxSize[0];
		assert.equal(0, getZoomLevelFromPixelSize(lowestLevelPxSize + 1));
	});

	it('return 0 if pixel size is between lowest and next level', function () {
		const lowestLevelPxSize = levelsPxSize[0];
		assert.equal(0, getZoomLevelFromPixelSize(lowestLevelPxSize - 1));
	});

	it('return 6 if pixel size is between 7th lowest and next level', function () {
		const levelPxSize = levelsPxSize[6];
		assert.equal(6, getZoomLevelFromPixelSize(levelPxSize - 1));
	});

	it('return 7 if pixel size is the same as 8th lowest level', function () {
		const levelPxSize = levelsPxSize[7];
		assert.equal(7, getZoomLevelFromPixelSize(levelPxSize));
	});

	it('return 24 if pixel size is lower then the highest level', function () {
		const levelPxSize = levelsPxSize[levelsPxSize.length - 1];
		assert.equal(
			levelsPxSize.length - 1,
			getZoomLevelFromPixelSize(levelPxSize - 0.00001)
		);
	});
});

describe('getMapViewportRange', function () {
	it('100 is smaller than 200', function () {
		assert.equal(getMapViewportRange(100, 200), 100);
	});
	it('100 is smaller than 200', function () {
		assert.equal(getMapViewportRange(200, 100), 100);
	});

	it('check if params are filled', function () {
		assert.equal(getMapViewportRange(100, null), null);
	});

	it('check if params are filled', function () {
		assert.equal(getMapViewportRange(undefined, 100), null);
	});
});

describe('getBoxRangeFromZoomLevel', function () {
	it('returns box range', function () {
		const width = 600; //px
		const height = 300; //px
		const boxRange = getBoxRangeFromZoomLevel(0, width, height);

		assert.equal(boxRange, 30187175.77750529);
	});

	it('returns box range', function () {
		const width = 300; //px
		const height = 600; //px
		const boxRange = getBoxRangeFromZoomLevel(0, width, height);

		assert.equal(boxRange, 30187175.77750529);
	});
});

describe('getPixelSizeFromZoomLevel', function () {
	it('returns pixel size for zero level in default latitude', function () {
		const pixelSize = getPixelSizeFromZoomLevel(0);
		assert.equal(pixelSize, 100623.9225916843);
	});

	it('returns pixel size for 9-th level in default latitude', function () {
		const pixelSize = getPixelSizeFromZoomLevel(9);
		assert.equal(pixelSize, 196.53109881188323);
	});
});

describe('getNearestZoomLevelBoxRange', function () {
	it('returns box range', function () {
		const width = 600; //px
		const height = 100; //px
		const boxRange = 100;
		const levelBoxRange = getNearestZoomLevelBoxRange(width, height, boxRange);

		const level = getZoomLevelFromBoxRange(boxRange, width, height);

		assert.equal(
			levelBoxRange,
			mapConstants.pixelSizeInLevels[level] * height - 1
		);
	});
});
