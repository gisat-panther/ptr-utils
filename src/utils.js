import {mapValues as _mapValues} from 'lodash';
import period from './period';
import {isObjectLike as _isObjectLike} from 'lodash';
import crypto from 'crypto';

export default {
	period,

	/**
	 * Generates v4 compliant UUID
	 * @returns {string|*|void}
	 */
	uuid() {
		if (typeof crypto?.randomUUID === 'function') {
			return crypto.randomUUID();
		} else if (typeof crypto?.getRandomValues === 'function') {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
				(
					c ^
					(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
				).toString(16)
			);
		} else {
			//fallback for undefined crypto
			let d = new Date().getTime(); //Timestamp
			let d2 =
				(typeof performance !== 'undefined' &&
					performance.now &&
					performance.now() * 1000) ||
				0; //Time in microseconds since page-load or 0 if unsupported
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
				/[xy]/g,
				function (c) {
					var r = Math.random() * 16; //random number between 0 and 16
					if (d > 0) {
						//Use timestamp until depleted
						r = (d + r) % 16 | 0;
						d = Math.floor(d / 16);
					} else {
						//Use microseconds since page-load if supported
						r = (d2 + r) % 16 | 0;
						d2 = Math.floor(d2 / 16);
					}
					return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
				}
			);
		}
	},

	/**
	 * Return true if uuid parameter is valid uuidv4, else return false.
	 * About uuid versions: https://www.uuidtools.com/decode
	 * @param {string} uuid
	 * @returns {Boolean}
	 */
	isValidUuidV4(uuid) {
		let s = '' + uuid;
		s = s.match(
			'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
		);
		if (s === null) {
			return false;
		}
		return true;
	},

	/**
	 * Generates random string of specified length.
	 * @param length
	 * @returns {string}
	 */
	randomString: length =>
		((Math.random() * Math.pow(36, length)) >> 0).toString(36),

	getRemSize: () => {
		if (typeof window === 'undefined') {
			//return default fontsize 16px when run on SSR
			return 16;
		} else {
			return parseFloat(getComputedStyle(document.documentElement).fontSize);
		}
	},

	scrollTo(elementId, containerId) {
		let element = document.getElementById(elementId);

		let elementOffset = element.offsetTop;

		document.getElementById(containerId).scrollTop = elementOffset;
	},

	/**
	 * Get json-like formatted string
	 * @param json {JSON | string | null}
	 * @return {string}
	 */
	getStringFromJson(json) {
		if (json && typeof json === 'object') {
			return JSON.stringify(json, null, 2);
		} else {
			return json;
		}
	},

	/**
	 * Takes deep object and returns it with values containing path to that key in the object (where value isn't a nested object).
	 * e.g. {a: null, b: {c: null, d: null}} => {a: 'a', b: {c: 'b.c', d: 'b.d'}}
	 * Used for constants.
	 * @param object - input object or nested object when called recursively
	 * @param path - path to nested object when called recursively
	 * @returns object
	 */
	deepKeyMirror(object, path) {
		if (_isObjectLike(object)) {
			return _mapValues(object, (value, key) => {
				return this.deepKeyMirror(value, path ? path + '.' + key : key);
			});
		} else {
			return path;
		}
	},

	stringToNumHash(string) {
		string = '' + string;
		if (typeof string !== 'string')
			throw new Error('stringToNumHash: argument must be a string');
		let hash = 1;
		for (let i = 0; i < string.length; i++) {
			hash = Math.imul((hash + string.charCodeAt(i)) | 0, 265443576107);
		}
		return (hash ^ (hash >>> 17)) >>> 0;
	},

	/**
	 * Deterministic colour set based on input string.
	 * @param string - input string
	 * @param count - number of colours
	 * @param options - hue, saturation and lightness ranges
	 * @returns {Array} css hsl codes
	 */
	stringToColours(string, count, options) {
		let hash = this.stringToNumHash(string);
		let colours = [];
		let defaults = {
			hue: [0, 360],
			saturation: [35, 65],
			lightness: [40, 60],
		};
		options = {...defaults, ...options};
		let h, s, l;
		let hueRange = options.hue[1] - options.hue[0];
		let saturationRange = options.saturation[1] - options.saturation[0];
		let lightnessRange = options.lightness[1] - options.lightness[0];
		for (let i = 0; i < (count || 1); i++) {
			h = (hash % hueRange) + options.hue[0];
			hash = (hash ^ (hash >>> 17)) >>> 0;
			s = (hash % saturationRange) + options.saturation[0];
			hash = (hash ^ (hash >>> 17)) >>> 0;
			l = (hash % lightnessRange) + options.lightness[0];
			hash = (hash ^ (hash >>> 17)) >>> 0;
			colours.push('hsl(' + h + ',' + s + '%,' + l + '%)');
		}
		return colours;
	},
};
