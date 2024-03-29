import 'isomorphic-fetch';

import view from './view';
import projections from './projections';

/**
 * @param placeString {string} Text (e.g. Praha, France, ...) or coordinates (e.g. 10,50 or 10;50 or 10 50 as latitude,longitude) as input
 * @return {Promise} {{center: {lon: number, lat: number}, boxRange: number}}
 */
function getLocationFromPlaceString(placeString) {
	let boxRange = 100000;
	let lat = null,
		lon = null;

	if (placeString.length) {
		let firstChar = Number(placeString[0]);
		if (isNaN(firstChar)) {
			let url =
				'https://open.mapquestapi.com/nominatim/v1/search.php?key=2qc94oOJwV6p7KaClJVSoLyevmPsLqlS&format=json&q=' +
				placeString +
				'&limit=1';

			return fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			}).then(
				response => {
					let contentType = response.headers.get('Content-type');
					if (
						response.ok &&
						contentType &&
						contentType.indexOf('application/json') !== -1
					) {
						return response.json().then(body => {
							if (body.length) {
								let data = body[0];
								lat = Number(data.lat);
								lon = Number(data.lon);
								if (data.boundingbox) {
									const bbox = data.boundingbox;
									boxRange = view.getBoxRangeFromBoundingBox({
										minLat: bbox[0],
										maxLat: bbox[1],
										minLon: bbox[2],
										maxLon: bbox[3],
									});
								}
								if ((lat || lat === 0) && (lon || lon === 0)) {
									return {boxRange, center: {lat, lon}};
								}
							} else {
								console.warn(
									'utils/map#getLocationFromPlaceString: No location found for input: ',
									placeString
								);
							}
						});
					} else {
						console.warn(
							'utils/map#getLocationFromPlaceString: No location found for input: ',
							placeString
						);
					}
				},
				error => {
					throw error;
				}
			);
		} else {
			let coordinates = placeString.split(/[,; ]/);
			if (coordinates.length) {
				lat = Number(coordinates[0]);
				lon = coordinates[1] ? Number(coordinates[1]) : 0;
			}

			if ((lat || lat === 0) && (lon || lon === 0)) {
				return Promise.resolve({boxRange, center: {lat, lon}});
			} else {
				console.warn(
					'utils/map#getLocationFromPlaceString: No location found for input: ',
					placeString
				);
			}
		}
	} else {
		console.warn('utils/map#getLocationFromPlaceString: Empty input string!');
	}
}

function mergeLayers(one, two) {
	// TODO remove duplicate keys
	if (one && two) {
		return [...one, ...two];
	} else {
		return one || two || null;
	}
}

function resetHeading(heading, callback, increment) {
	heading %= 360;
	if (heading < 0) {
		heading += 360;
	}

	if (!increment) {
		increment = 3.0;
		if (heading > 120 && heading < 240) {
			increment = 5.0;
		} else if (heading > 60 && heading < 300) {
			increment = 8.0;
		}

		//set shortest direction based on angle
		if ((heading > 0 && heading < 180) || (heading < 0 && heading < -180)) {
			increment = -increment;
		}
	}

	setTimeout(() => {
		if (Math.abs(heading) > Math.abs(increment)) {
			heading = heading + increment;
			callback(heading);
			resetHeading(heading, callback, increment);
		} else {
			heading = 0;
			callback(heading);
		}
	}, 20);
}

export default {
	view,
	projections,

	getLocationFromPlaceString,
	mergeLayers,
	resetHeading,
};

export {
	projections,
	view,
	getLocationFromPlaceString,
	mergeLayers,
	resetHeading,
};
