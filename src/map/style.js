import {each as _each} from 'lodash';
import chroma from 'chroma-js';

const DEFAULT_SIZE = 15;

/**
 * Get style object for vector
 * @param attributes {Object} Feature attributes
 * @param styleDefinition {Object} Panther style definition
 * @returns {Object} Panther style object
 */
function getStyleObject(attributes, styleDefinition) {
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
 * Get style object for raster
 * @param bands {Array} Pixel values
 * @param styleDefinition {Object} Panther style definition
 * @returns {Object} Panther style object
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
					let styleObject = null;
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
 * @param styleDefinition {Object} Style definition for given attribute key
 * @param attributes {Object} Feature attributes
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
			return getStyleObjectForAttributeScale(
				styleDefinition.attributeScale,
				value
			);
		} else if (styleDefinition.attributeTransformation) {
			return getStyleObjectForAttributeTransformation(
				styleDefinition.attributeTransformation,
				value
			);
		} else if (styleDefinition.attributeValues) {
			return getStyleObjectForValues(styleDefinition.attributeValues, value);
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
 * @param styleDefinition {Object} Style definition for given band
 * @param value {number} Pixel value
 * @return {Object} Style object for given value
 */
function getStyleObjectForBand(styleDefinition, value) {
	if (value || value === 0) {
		if (styleDefinition.values) {
			return getStyleObjectForValues(styleDefinition.values, value);
		} else if (styleDefinition.valueClasses) {
			return getStyleObjectForIntervals(styleDefinition.valueClasses, value);
		} else if (styleDefinition.scale) {
			return getStyleObjectForPixelValueScale(styleDefinition.scale, value);
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
 * Get style object for vector attributeClasses/raster valueClasses
 * @param intervals {Array} All intervals
 * @param value {number} attribute value
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
			styleObject = intervalItem;
		}
	});

	return styleObject;
}

/**
 * Get style object for vector attributeValues/raster pixel values
 * @param valuesDefinition {Array} value-based style definition
 * @param value {number|string} attribute value
 * @returns {Object} Panther style object
 */
function getStyleObjectForValues(valuesDefinition, value) {
	return valuesDefinition[value] || {};
}

// ATTRIBUTE STYLE TYPES ---------------------------------------------------------------

/**
 * Attribute scale
 *
 * @param attributeScale {Object}
 * @param value {number|String} attribute value
 */
function getStyleObjectForAttributeScale(attributeScale, value) {
	let parameter = Object.keys(attributeScale)[0];
	let definitions = attributeScale[parameter];

	// check transformations
	if (definitions.inputTransformation) {
		value = doMathOperations(definitions.inputTransformation, value);
	}

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
				[parameter]: scaleValue(
					definitions.inputInterval,
					definitions.outputInterval,
					value
				),
			};
		case 'outlineColor':
		case 'diagramOutlineColor':
		case 'fill':
		case 'diagramFill':
			let scale = chroma
				.scale(definitions.outputInterval)
				.domain(definitions.inputInterval);
			return {
				[parameter]: chroma(scale(value)).hex(),
			};
		default:
			return {};
	}
}

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

// RASTER STYLE TYPES ---------------------------------------------------------------

/**
 * Pixel value scale
 *
 * @param scale {Object}
 * @param value {number} pixel value
 * @return {Object} Panther style object
 */
function getStyleObjectForPixelValueScale(scale, value) {
	if (scale.color) {
		let {
			inputTransformation,
			inputInterval,
			inputIntervalBounds,
			outputInterval,
		} = scale.color;

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
			let colorScale = chroma.scale(outputInterval).domain(inputInterval);
			return {
				color: chroma(colorScale(value)).hex(),
			};
		} else {
			return null;
		}
	} else {
		return null;
	}
}

// HELPERS --------------------------------------------------------------------------------
function scaleValue(inputInterval, outputInterval, value) {
	const x1 = inputInterval[0];
	const x2 = inputInterval[1];
	const y1 = outputInterval[0];
	const y2 = outputInterval[1];

	return (value - x1) * ((y2 - y1) / (x2 - x1)) + y1;
}

function isGreaterThan(comparedValue, referenceValue, allowEquality) {
	if (comparedValue || comparedValue === 0) {
		if (allowEquality) {
			return comparedValue >= referenceValue;
		} else {
			return comparedValue > referenceValue;
		}
	} else {
		return false;
	}
}

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
	getStyleObject,
	getStyleObjectForRaster,

	getStyleObjectForValues,
	getStyleObjectForIntervals,
	hexToRgb,
	DEFAULT_SIZE,
};
