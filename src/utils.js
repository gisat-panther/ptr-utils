import _ from 'lodash';
import period from './period';

export default {
	period,

	/**
	 * Generates v4 compliant UUID
	 * @returns {string|*|void}
	 */
	uuid() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(
				c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
			).toString(16)
		);
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
			parseFloat(getComputedStyle(document.documentElement).fontSize);
		}
	},

	scrollTo(elementId, containerId, duration) {
		let animationDuration = duration ? duration : 200;
		let container = document.getElementById(containerId);
		let element = document.getElementById(elementId);

		let elementOffset = element.offsetTop;
		let elementHeight = element.offsetHeight;
		let containerHeight = container.offsetHeight;
		let scroll = elementOffset + elementHeight - containerHeight + 10;

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
		if (_.isObjectLike(object)) {
			return _.mapValues(object, (value, key) => {
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
