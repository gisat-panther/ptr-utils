import {isNumber as _isNumber} from 'lodash';

const quartilePercentiles = [0, 0.166, 0.333, 0.5, 0.666, 0.833, 1];

/**
 *
 * @param {Object} statistics
 * @param {number} classesCount
 * @returns {Array} break class values with first and last point
 */
const getValueClassesByStatistics = (statistics, classesCount = 1) => {
	const min = Number.parseFloat(statistics.min);
	const max = Number.parseFloat(statistics.max);
	const width = (max - min) / classesCount;
	const classes = [];
	for (let i = 0; i < classesCount + 1; i++) {
		classes[i] = min + i * width;
	}
	return classes;
};

/**
 *
 * @param {Array} classes Array of break class values with first and last point
 * @param {number} value
 * @returns {number} class index
 */
const getClassByValue = (classes, value) => {
	return classes[0] === value ? 0 : classes.findIndex(b => value <= b) - 1;
};

/**
 *
 * @param {Array} statistics
 */
const mergeAttributeStatistics = (statistics = []) => {
	const mergedStatistics = {
		min: null,
		max: null,
		percentile: [],
	};

	for (const statistic of statistics) {
		if (statistic && statistic.attributeStatistic) {
			mergedStatistics.min =
				mergedStatistics.min || mergedStatistics.min === 0
					? Math.min(mergedStatistics.min, statistic.attributeStatistic.min)
					: statistic.attributeStatistic.min;
			mergedStatistics.max =
				mergedStatistics.max || mergedStatistics.max === 0
					? Math.max(mergedStatistics.max, statistic.attributeStatistic.max)
					: statistic.attributeStatistic.max;
		}
	}

	const percentilesCount =
		statistics[0] &&
		statistics[0].attributeStatistic &&
		statistics[0].attributeStatistic.percentile.length;
	const statisticsCount = statistics.length;
	for (let index = 0; index < percentilesCount; index++) {
		let sum = 0;
		for (const statistic of statistics) {
			if (statistic && statistic.attributeStatistic) {
				sum += statistic.attributeStatistic.percentile[index];
			}
		}
		mergedStatistics.percentile[index] = sum / statisticsCount;
	}

	mergedStatistics.percentile[0] = mergedStatistics.min;
	mergedStatistics.percentile[mergedStatistics.percentile.length - 1] =
		mergedStatistics.max;

	//check if min and max is filled
	const minFilled = _isNumber(mergedStatistics.min);
	const maxFilled = _isNumber(mergedStatistics.max);

	return minFilled && maxFilled ? mergedStatistics : null;
};

const getClassCount = (classes = []) => {
	return Math.max(0, classes.length - 1);
};

const getMiddleClassValues = (classes = []) => {
	return classes.reduce((acc, val, idx, src) => {
		if (idx > 0) {
			acc.push((src[idx - 1] + src[idx]) / 2);
			return acc;
		} else {
			return acc;
		}
	}, []);
};

const getClassesIntervals = (classes = []) => {
	const collectedClasses = [...new Set(classes)];
	if (collectedClasses.length !== 1) {
		const intervals = collectedClasses.reduce((acc, val, idx, src) => {
			if (idx > 0) {
				acc.push([src[idx - 1], src[idx]]);
			}

			return acc;
		}, []);
		return intervals;
	} else {
		//probably only one value in cartogram
		return [[collectedClasses[0], collectedClasses[0]]];
	}
};

const setClassesMinMaxFromStatistics = (classes = [], statistics) => {
	const modified = [...classes];
	modified[0] = statistics.min;
	modified[classes.length - 1] = statistics.max;
	return modified;
};

// rangeMap :: (Num, Num) -> (Num, Num) -> Num -> Num
const rangeMap = (a, b) => s => {
	const [a1, a2] = a;
	const [b1, b2] = b;
	// Scaling up an order, and then down, to bypass a potential,
	// precision issue with negative numbers.
	return ((((b2 - b1) * (s - a1)) / (a2 - a1)) * 10 + 10 * b1) / 10;
};

export default {
	getClassByValue,
	getClassCount,
	getClassesIntervals,
	getMiddleClassValues,
	getValueClassesByStatistics,
	mergeAttributeStatistics,
	quartilePercentiles,
	rangeMap,
	setClassesMinMaxFromStatistics,
};
