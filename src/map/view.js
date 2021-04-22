import turfBbox from '@turf/bbox';
import turfCenter from '@turf/center';
import createCachedSelector from 're-reselect';
import {isArray as _isArray} from 'lodash';
import {mapConstants} from '@gisatcz/ptr-core';
import math from '../math';
import projections from './projections';

/**
 * @param boxRange {number} Panther view boxRange
 * @param width {number} map width
 * @param height {number} map height
 * @return {number} Zoom level
 */
function getZoomLevelFromBoxRange(boxRange, width, height) {
	// remove 1 from box range to prevent rounding issues
	return getZoomLevelFromPixelSize(
		(boxRange - 1) / getMapViewportRange(width, height)
	);
}

/**
 * Calculate zoom level from pixel size in meters. It returns next lower (or the lowest) level
 * @param pxSize {number} pixel size in meters
 * @return {number} Zoom level
 */
function getZoomLevelFromPixelSize(pxSize) {
	const levels = mapConstants.pixelSizeInLevels;

	let level = 0;
	while (pxSize <= levels[level + 1] && level < levels.length) {
		level++;
	}
	return level;
}

/**
 *
 * @param bbox {{minLat: number, minLon: number, maxLat: number, maxLon: number}}
 * @param latitude {boolean}
 * @return {number}
 */
function getBoxRangeFromBoundingBox(bbox, latitude) {
	const MIN_BOX_RANGE = 1000;
	const RANGE_COEFF = 125000; //approximately one degree of longitude on equator in meters

	// TODO naive for now
	let latDiff = Math.abs(bbox.maxLat - bbox.minLat);
	let lonDiff = Math.abs(bbox.maxLon - bbox.minLon);

	let diff = Math.max(latDiff, lonDiff);
	let boxRange = RANGE_COEFF * diff;
	if (latitude) {
		boxRange /= Math.cos((latitude * Math.PI) / 180);
	}

	return boxRange > MIN_BOX_RANGE ? boxRange : MIN_BOX_RANGE;
}

// TODO naive for now
function getViewFromBoundingBox(bbox, reflectLatitude) {
	if (_isArray(bbox)) {
		bbox = {
			minLat: bbox[1],
			minLon: bbox[0],
			maxLat: bbox[3],
			maxLon: bbox[2],
		};
	}

	const center = {
		lat: (bbox.maxLat + bbox.minLat) / 2,
		lon: (bbox.maxLon + bbox.minLon) / 2,
	};

	const boxRange = getBoxRangeFromBoundingBox(
		bbox,
		reflectLatitude ? center.lat : null
	);

	return {
		center,
		boxRange,
	};
}

/**
 * @param geometry {Object} geojson geometry
 * @param reflectLatitude {boolean}
 * @return {Object} view
 */
function getViewFromGeometry(geometry, reflectLatitude) {
	let center = turfCenter(geometry);
	let bbox = turfBbox(geometry);
	let boxRange = getBoxRangeFromBoundingBox(
		{
			minLat: bbox[1],
			minLon: bbox[0],
			maxLat: bbox[3],
			maxLon: bbox[2],
		},
		reflectLatitude ? center.geometry.coordinates[1] : null
	);

	return {
		center: {
			lat: center.geometry.coordinates[1],
			lon: center.geometry.coordinates[0],
		},
		boxRange,
	};
}

const ensureViewIntegrity = view => {
	if (view) {
		if (view.heading && view.heading > 360) {
			view.heading = view.heading % 360;
		}

		if (view.heading && view.heading < 0) {
			view.heading = 360 - (-view.heading % 360);
		}

		if (view.tilt && view.tilt < 0) {
			view.tilt = 0;
		}

		if (view.tilt && view.tilt > 90) {
			view.tilt = 90;
		}

		if (view.range && view.range < 0.01) {
			view.range = 0.01;
		}

		if (view.center) {
			if (view.center.lat) {
				if (view.center.lat > 90) {
					view.center.lat = 90;
				} else if (view.center.lat < -90) {
					view.center.lat = -90;
				}
			}

			if (view.center.lon) {
				if (view.center.lon > 360 || view.center.lon < -360) {
					view.center.lon %= 360;
				}

				if (view.center.lon > 180) {
					view.center.lon = -180 + (view.center.lon - 180);
				} else if (view.center.lon < -180) {
					view.center.lon = 180 + (view.center.lon + 180);
				} else if (view.center.lon === -180) {
					view.center.lon = 180;
				}
			}
		}
	}

	return view;
};

const mergeViews = createCachedSelector(
	[one => one, (one, two) => two, (one, two, three) => three],
	(one, two, three) => {
		three = three || {};
		return {...one, ...two, ...three};
	}
)((one, two, three) => `${one}_${two}_${three || ''}`);

/**
 * TODO add optLat as oprional parameter
 * Determinate nearest higher zoom level.
 * @param level {number} zoom level
 * @param width {number} map width
 * @param height {number} map height
 * @return {number} Panther box range
 */
function getBoxRangeFromZoomLevel(level, width, height) {
	// remove 1 from box range to prevent rounding issues
	return (
		getMapViewportRange(width, height) * getPixelSizeFromZoomLevel(level) - 1
	);
}

/**
 * TODO add optLat as oprional parameter
 * Determinate pixel size from given level.
 * @param level {number} zoom level
 * @return {number} Size of 1 px in meters
 */
function getPixelSizeFromZoomLevel(level) {
	return mapConstants.pixelSizeInLevels[level];
}

/**
 * Returns smaller size from given width and height
 * @param {number} width
 * @param {number} height
 */
function getMapViewportRange(width, height) {
	if (width && width > -1 && height && height > -1) {
		return Math.min(height, width);
	} else {
		return null;
	}
}

/**
 * TODO add optLat as oprional parameter
 * Determinate nearest zoom level for given boxRange and return its boxRange.
 * @param {number} width
 * @param {number} height
 * @param {number} boxRange
 */
function getNearestZoomLevelBoxRange(width, height, boxRange) {
	const zoom = getZoomLevelFromBoxRange(boxRange, width, height);
	const newBoxRange = getBoxRangeFromZoomLevel(zoom, width, height);
	return newBoxRange;
}

/**
 * Calculate bounding box from view for map in EPSG 3857 (Web Mercator) projection
 * @param center {{lat: Number, lon: Number}} Panther view center
 * @param boxRange {Number} Panther view box range
 * @param viewportRatio {Number} Width/height ratio of map window
 * @param optLat {Number} The latitude used to minimise the distortion between 2D and 3D projection
 * @return {{minLon: number, maxLat: number, minLat: number, maxLon: number}} Bounding box
 */
function getBoundingBoxFromViewForEpsg3857(
	center,
	boxRange,
	viewportRatio,
	optLat
) {
	// convert back the boxRange which was adjusted in map in EPSG 3857 projection
	// if optLat exists && cos(optLat) !== 0
	if (optLat && optLat % 90 !== 0) {
		boxRange /= Math.cos(math.degToRadians(optLat));
	}

	// calculate visible distance in vertical and horizontal direction
	const distanceY = viewportRatio > 1 ? boxRange : boxRange / viewportRatio;
	const distanceX = viewportRatio <= 1 ? boxRange : boxRange * viewportRatio;

	// get center coordinates in EPSG 3857
	const center3857 = projections.coordinates4326To3857(center);
	const {x, y} = center3857;

	// coordinates of viewport boundaries in EPSG 3857
	const minX = x - distanceX / 2;
	const maxX = x + distanceX / 2;
	const minY = y - distanceY / 2;
	const maxY = y + distanceY / 2;

	// corners in EPSG 4326
	const bottomLeft4326 = projections.coordinates3857To4326({x: minX, y: minY});
	const topRight4326 = projections.coordinates3857To4326({x: maxX, y: maxY});

	return {
		minLat: bottomLeft4326.lat,
		minLon: bottomLeft4326.lon,
		maxLat: topRight4326.lat,
		maxLon: topRight4326.lon,
	};
}

export default {
	ensureViewIntegrity,
	mergeViews,
	getBoundingBoxFromViewForEpsg3857,
	getBoxRangeFromZoomLevel,
	getNearestZoomLevelBoxRange,
	getMapViewportRange,
	getPixelSizeFromZoomLevel,
	getViewFromBoundingBox,
	getViewFromGeometry,
	getZoomLevelFromBoxRange,
	getZoomLevelFromPixelSize,
};

export {
	ensureViewIntegrity, //check use in ptr-state
	mergeViews,
	getBoundingBoxFromViewForEpsg3857,
	getBoxRangeFromZoomLevel,
	getNearestZoomLevelBoxRange,
	getMapViewportRange,
	getPixelSizeFromZoomLevel,
	getViewFromBoundingBox,
	getViewFromGeometry,
	getZoomLevelFromBoxRange,
	getZoomLevelFromPixelSize,
};
