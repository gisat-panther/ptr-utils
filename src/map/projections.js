import math from '../math';

// WGS-84 spheroid equatorial radius TODO move to ptr-core constants
export const WGS_SPHERE_RADIUS = 6378137;

// Web mercator projection displays world between 85.06°S and 85.06°N.
export const EPSG_3857_PROJECTED_BBOX = {
	maxX: 20037508.34,
	maxY: 20048966.1,
	minX: -20037508.34,
	minY: -20048966.1,
};

export const EPSG_3857_WGS84_BBOX = {
	maxLat: 85.06,
	maxLon: 180,
	minLat: -85.06,
	minLon: -180,
};

/**
 * Convert coordinates from EPSG 4326 to EPSG 3857
 * @param coord {{lon: Number, lat: Number}} coordinates in EPSG 4326 (WGS-84)
 * @return {{x: Number, y: Number}} coordinates in EPSG 3857 (Web Mercator)
 */
function coordinates4326To3857(coord) {
	let {lat, lon} = coord;

	// Cut latitude if it's outside bounds
	if (lat > EPSG_3857_WGS84_BBOX.maxLat) {
		lat = EPSG_3857_WGS84_BBOX.maxLat;
	} else if (lat < EPSG_3857_WGS84_BBOX.minLat) {
		lat = EPSG_3857_WGS84_BBOX.minLat;
	}

	const x = math.degToRadians(lon) * WGS_SPHERE_RADIUS;
	const y = Math.atanh(Math.sin(math.degToRadians(lat))) * WGS_SPHERE_RADIUS;

	return {x, y};
}

/**
 * Convert coordinates from EPSG 3857 to EPSG 4326
 * @param coord {{x: Number, y: Number}} coordinates in EPSG 3857 (Web Mercator)
 * @return {{lon: Number, lat: Number}} coordinates in EPSG 4326 (WGS-84)
 */
function coordinates3857To4326(coord) {
	let {x, y} = coord;

	// Cut y if it's outside bounds
	if (y > EPSG_3857_PROJECTED_BBOX.maxY) {
		y = EPSG_3857_PROJECTED_BBOX.maxY;
	} else if (y < EPSG_3857_PROJECTED_BBOX.minY) {
		y = EPSG_3857_PROJECTED_BBOX.minY;
	}

	const lon = math.radiansToDeg(x / WGS_SPHERE_RADIUS);
	const lat = math.radiansToDeg(Math.asin(Math.tanh(y / WGS_SPHERE_RADIUS)));

	return {lon, lat};
}

export default {
	coordinates3857To4326,
	coordinates4326To3857,
};
