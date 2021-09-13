import {each as _each} from 'lodash';
import chroma from 'chroma-js';

const DEFAULT_SIZE = 15;

/**
 * Get style object for vector feature
 * @param attributes {Object} Feature attributes
 * @param styleDefinition {Object} Panther style definition
 * @returns {Object} Merged Panther style object for given feature
 */
function getStyleObjectForVector(attributes, styleDefinition) {
	let finalStyleObject = {};

	if (styleDefinition && styleDefinition.rules) {
		_each(styleDefinition.rules, rule => {
			if (rule.filter) {
				// TODO apply filter
			}

			if (rule.styles) {
				_each(rule.styles, style => {
					let styleObject = null;
					if (style.attributeKey) {
						styleObject = getStyleObjectForAttribute(style, attributes);
					} else {
						styleObject = style;
					}

					finalStyleObject = {...finalStyleObject, ...styleObject};
				});
			}
		});
	}

	return finalStyleObject;
}

/**
 * Get style object for raster pixel
 * @param bands {Array} Pixel values
 * @param styleDefinition {Object} Panther style definition
 * @returns {Object} Merged Panther style object for given pixel value
 */
function getStyleObjectForRaster(bands, styleDefinition) {
	let finalStyleObject = {};

	if (styleDefinition && styleDefinition.rules) {
		_each(styleDefinition.rules, rule => {
			if (rule.filter) {
				// TODO apply filter
			}

			if (rule.styles) {
				_each(rule.styles, style => {
					let styleObject;
					if (style.bandIndex > -1) {
						styleObject = getStyleObjectForBand(style, bands[style.bandIndex]);
					} else {
						styleObject = style;
					}

					finalStyleObject = {...finalStyleObject, ...styleObject};
				});
			}
		});
	}

	return finalStyleObject;
}

/**
 * Get style object for attribute of given feature
 * @param styleDefinition {Object} Style definition for given attribute key
 * @param attributes {Object} All feature attributes
 * @return {Object} Style object for given attribute key
 */
function getStyleObjectForAttribute(styleDefinition, attributes) {
	if (attributes.hasOwnProperty(styleDefinition.attributeKey)) {
		let value = attributes[styleDefinition.attributeKey];
		if (styleDefinition.attributeClasses) {
			return getStyleObjectForIntervals(
				styleDefinition.attributeClasses,
				value
			);
		} else if (styleDefinition.attributeScale) {
			return getStyleObjectForScale(styleDefinition.attributeScale, value);
		} else if (styleDefinition.attributeTransformation) {
			return getStyleObjectForAttributeTransformation(
				styleDefinition.attributeTransformation,
				value
			);
		} else if (styleDefinition.attributeValues) {
			return getStyleObjectForValue(styleDefinition.attributeValues, value);
		}
		// TODO add other cases
		else {
			return {};
		}
	} else {
		return {};
	}
}

/**
 * Get style object for band of given pixel
 * @param styleDefinition {Object} Style definition for given band
 * @param value {number} Pixel value
 * @return {Object} Style object for given pixel
 */
function getStyleObjectForBand(styleDefinition, value) {
	if (value || value === 0) {
		if (styleDefinition.values) {
			return getStyleObjectForValue(styleDefinition.values, value);
		} else if (styleDefinition.valueClasses) {
			return getStyleObjectForIntervals(styleDefinition.valueClasses, value);
		} else if (styleDefinition.scale) {
			return getStyleObjectForScale(styleDefinition.scale, value);
		}
		// TODO add other cases
		else {
			return {};
		}
	} else {
		return {};
	}
}

/**
 * Get style object for attributeClasses in vector layer or valueClasses in raster layer for given value.
 * @param intervals {Array} All intervals definitions
 * @param value {number} attribute/pixel value
 * @returns {Object} Panther style object
 */
function getStyleObjectForIntervals(intervals, value) {
	let styleObject = {};
	_each(intervals, intervalItem => {
		let {interval, intervalBounds} = intervalItem;

		if (!intervalBounds) {
			intervalBounds = [true, false];
		}

		if (
			isGreaterThan(value, interval[0], intervalBounds[0]) &&
			isGreaterThan(interval[1], value, intervalBounds[1])
		) {
			// return whole object (even with non-style props such as interval, intervalBounds, ...) due to performance
			styleObject = intervalItem;
		}
	});

	return styleObject;
}

/**
 * Get style object for vector attributeValues/raster pixel values for given value
 * @param valuesDefinition {Object} value-based style definition
 * @param value {number|string} attribute/pixel value
 * @returns {Object} Panther style object
 */
function getStyleObjectForValue(valuesDefinition, value) {
	return valuesDefinition[value] || {};
}

/**
 * Get style object for vector attributeScales/raster pixel value scale for given value
 * @param scaleDefinition {Object} scale style definition
 * @param value {number} attribute/pixel value
 * @returns {Object} Panther style object
 */
function getStyleObjectForScale(scaleDefinition, value) {
	const parameter = Object.keys(scaleDefinition)[0];
	const definitions = scaleDefinition[parameter];

	let {
		inputTransformation,
		inputInterval,
		inputIntervalBounds,
		outputInterval,
	} = definitions;

	// check transformations
	if (inputTransformation) {
		value = doMathOperations(inputTransformation, value);
	}

	if (!inputIntervalBounds) {
		inputIntervalBounds = [true, true];
	}

	if (
		isGreaterThan(value, inputInterval[0], inputIntervalBounds[0]) &&
		isGreaterThan(inputInterval[1], value, inputIntervalBounds[1])
	) {
		switch (parameter) {
			case 'outlineWidth':
			case 'diagramOutlineWidth':
			case 'outlineOpacity':
			case 'diagramOpacity':
			case 'fillOpacity':
			case 'diagramFillOpacity':
			case 'size':
			case 'diagramSize':
			case 'volume':
			case 'diagramVolume':
			case 'arrowLength':
				return {
					[parameter]: scaleValue(inputInterval, outputInterval, value),
				};
			case 'outlineColor':
			case 'diagramOutlineColor':
			case 'fill':
			case 'diagramFill':
			case 'color':
				let scale = chroma.scale(outputInterval).domain(inputInterval);
				return {
					[parameter]: chroma(scale(value)).hex(),
				};
			default:
				return {};
		}
	} else {
		return {};
	}
}

/**
 * TODO still used?
 * @param attributeTransformation {Object} Attribute transformation definitions
 * @param value {number|string} Attribute value
 * @returns {{arrowDirection}|{}} Style object
 */
function getStyleObjectForAttributeTransformation(
	attributeTransformation,
	value
) {
	let parameter = Object.keys(attributeTransformation)[0];
	let definitions = attributeTransformation[parameter];

	// check transformations
	if (definitions.inputTransformation) {
		value = doMathOperations(definitions.inputTransformation, value);
	}

	if (parameter === 'arrowDirection') {
		return {
			arrowDirection: value,
		};
	} else {
		return {};
	}
}

// HELPERS --------------------------------------------------------------------------------

/**
 * Scale value from input range according to output range
 * @param inputRange {Array}
 * @param outputRange {Array}
 * @param value {number}
 * @returns {number} scaled value
 */
function scaleValue(inputRange, outputRange, value) {
	const x1 = inputRange[0];
	const x2 = inputRange[1];
	const y1 = outputRange[0];
	const y2 = outputRange[1];

	if (value >= x1 && value <= x2) {
		return (value - x1) * ((y2 - y1) / (x2 - x1)) + y1;
	} else {
		throw new Error('map/style#scaleValue: Given value is out of input range!');
	}
}

/**
 * Check if value is greater than reference or equal
 * @param value {number}
 * @param referenceValue {number}
 * @param allowEquality {boolean}
 * @returns {boolean}
 */
function isGreaterThan(value, referenceValue, allowEquality) {
	if (value || value === 0) {
		if (allowEquality) {
			return value >= referenceValue;
		} else {
			return value > referenceValue;
		}
	} else {
		return false;
	}
}

/**
 * Do math operations with given value
 * @param operations {Array} list of operations
 * @param value {number}
 * @returns {number} adjusted value
 */
function doMathOperations(operations, value) {
	_each(operations, operation => {
		if (operation === 'abs') {
			value = Math.abs(value);
		} else if (operation === 'sign') {
			value = Math.sign(value);
		}
	});

	return value;
}

/**
 * Convert color hex code to RGB object
 * @param hex {string} color hex code
 * @returns {{r: number, b: number, g: number}|null}
 */
function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

export default {
	getStyleObject: getStyleObjectForVector,
	getStyleObjectForRaster,
	getStyleObjectForVector,

	getStyleObjectForAttribute,
	getStyleObjectForBand,

	getStyleObjectForIntervals,
	getStyleObjectForScale,
	getStyleObjectForValues: getStyleObjectForValue,
	getStyleObjectForValue,

	scaleValue,
	isGreaterThan,
	doMathOperations,
	hexToRgb,
	DEFAULT_SIZE,
};
