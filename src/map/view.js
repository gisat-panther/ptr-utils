import * as turf from '@turf/turf';
import createCachedSelector from "re-reselect";
import _ from "lodash";
import {mapConstants} from '@gisatcz/ptr-core';

/**
 * @param boxRange {number} Panther view boxRange
 * @param width {number} map width
 * @param height {number} map height
 * @return {number} Zoom level
 */
function getZoomLevelFromBoxRange(boxRange, width, height) {
    // remove 1 from box range to prevent rounding issues
    return getZoomLevelFromPixelSize((boxRange - 1)/Math.min(width, height));
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
	let boxRange = RANGE_COEFF*diff;
	if (latitude) {
		boxRange /= Math.cos(latitude * Math.PI/180)
    }

	return boxRange > MIN_BOX_RANGE ? boxRange : MIN_BOX_RANGE;
}

// TODO naive for now
function getViewFromBoundingBox(bbox, reflectLatitude) {
	if (_.isArray(bbox)) {
		bbox = {
			minLat: bbox[1],
			minLon: bbox[0],
			maxLat: bbox[3],
			maxLon: bbox[2]
		}
	}

	const center = {
		lat: (bbox.maxLat + bbox.minLat)/2,
		lon: (bbox.maxLon + bbox.minLon)/2
	};

	const boxRange = getBoxRangeFromBoundingBox(bbox, reflectLatitude ? center.lat : null);

	return {
		center,
		boxRange
	}
}

/**
 * @param geometry {Object} geojson geometry
 * @param reflectLatitude {boolean}
 * @return {Object} view
 */
function getViewFromGeometry(geometry, reflectLatitude) {
	let center = turf.center(geometry);
	let bbox = turf.bbox(geometry);
	let boxRange = getBoxRangeFromBoundingBox({
		minLat: bbox[1],
		minLon: bbox[0],
		maxLat: bbox[3],
		maxLon: bbox[2]
	}, reflectLatitude ? center.geometry.coordinates[1] : null);

	return {
		center: {
			lat: center.geometry.coordinates[1],
			lon: center.geometry.coordinates[0]
		},
		boxRange
	}
}


const ensureViewIntegrity = (view) => {
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
	[
		(one) => one,
		(one, two) => two,
		(one, two, three) => three
	],
	(one, two, three) => {
		three = three || {};
		return {...one, ...two, ...three};
	}
)(
	(one, two, three) => `${one}_${two}_${three || ""}`
);

export default {
    ensureViewIntegrity,
    mergeViews,
    getViewFromBoundingBox,
    getViewFromGeometry,
    getZoomLevelFromBoxRange,
    getZoomLevelFromPixelSize,
}

export {
    ensureViewIntegrity, //check use in ptr-state
    mergeViews,
    getViewFromBoundingBox,
    getViewFromGeometry,
    getZoomLevelFromBoxRange,
    getZoomLevelFromPixelSize,
}