import {describe, it} from 'mocha';
import {assert} from 'chai';
import statistics from '../src/statistics';

describe('statistics', function () {
	describe('getClassByValue', function () {
		const tests = [
			{
				name: 'first match',
				classes: [0, 2, 4, 6, 8, 10],
				value: 0,
				expectedResult: 0,
			},
			{
				name: 'exact match',
				classes: [0, 2, 4, 6, 8, 10],
				value: 6,
				expectedResult: 2,
			},
			{
				name: 'non exact match',
				classes: [0, 2, 4, 6, 8, 10],
				value: 5,
				expectedResult: 2,
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.strictEqual(
					statistics.getClassByValue(test.classes, test.value),
					test.expectedResult
				);
			});
		});
	});

	describe('getClassCount', function () {
		const tests = [
			{
				name: 'empty',
				classes: [],
				expectedResult: 0,
			},
			{
				name: 'one element',
				classes: [0],
				expectedResult: 0,
			},
			{
				name: 'two elements',
				classes: [0, 2],
				expectedResult: 1,
			},
			{
				name: '6 elements',
				classes: [0, 2, 4, 6, 8, 10],
				expectedResult: 5,
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.strictEqual(
					statistics.getClassCount(test.classes),
					test.expectedResult
				);
			});
		});
	});

	describe('getClassesIntervals', function () {
		const tests = [
			{
				name: 'empty',
				classes: [],
				expectedResult: [],
			},
			{
				name: '1 element',
				classes: [2],
				expectedResult: [[2, 2]],
			},
			{
				name: '6 elements',
				classes: [0, 2, 4, 6, 8, 10],
				expectedResult: [
					[0, 2],
					[2, 4],
					[4, 6],
					[6, 8],
					[8, 10],
				],
			},
			{
				name: '6 elements after removed duplicities',
				classes: [0, 2, 2, 4, 4, 6, 8, 10],
				expectedResult: [
					[0, 2],
					[2, 4],
					[4, 6],
					[6, 8],
					[8, 10],
				],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					statistics.getClassesIntervals(test.classes),
					test.expectedResult
				);
			});
		});
	});

	describe('getMiddleClassValues', function () {
		const tests = [
			{
				name: 'empty',
				classes: [],
				expectedResult: [],
			},
			{
				name: '1 element',
				classes: [2],
				expectedResult: [],
			},
			{
				name: '6 elements',
				classes: [0, 2, 4, 6, 8, 10],
				expectedResult: [1, 3, 5, 7, 9],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					statistics.getMiddleClassValues(test.classes),
					test.expectedResult
				);
			});
		});
	});

	describe('getValueClassesByStatistics', function () {
		const tests = [
			{
				name: 'integers',
				statistics: {
					min: 0,
					max: 10,
				},
				classesCount: 5,
				expectedResult: [0, 2, 4, 6, 8, 10],
			},
			{
				name: 'floats',
				statistics: {
					min: 0,
					max: 1,
				},
				classesCount: 2,
				expectedResult: [0, 0.5, 1],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					statistics.getValueClassesByStatistics(
						test.statistics,
						test.classesCount
					),
					test.expectedResult
				);
			});
		});
	});

	describe('mergeAttributeStatistics', function () {
		const tests = [
			{
				name: 'empty',
				statistics: [],
				expectedResult: null,
			},
			{
				name: 'single without percentile',
				statistics: [{attributeStatistic: {min: 5, max: 10, percentile: []}}],
				expectedResult: {min: 5, max: 10, percentile: [10]},
			},
			{
				name: 'single with percentiles',
				statistics: [
					{
						attributeStatistic: {
							min: 5,
							max: 10,
							percentile: [1, 3, 11],
						},
					},
				],
				expectedResult: {min: 5, max: 10, percentile: [5, 3, 10]},
			},
			{
				name: 'multiple with percentiles',
				statistics: [
					{
						attributeStatistic: {
							min: 5,
							max: 8,
							percentile: [1, 3, 11],
						},
					},
					{
						attributeStatistic: {
							min: 6,
							max: 10,
							percentile: [2, 4, 9],
						},
					},
				],
				expectedResult: {min: 5, max: 10, percentile: [5, 3.5, 10]},
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					statistics.mergeAttributeStatistics(test.statistics),
					test.expectedResult
				);
			});
		});
	});

	describe('setClassesMinMaxFromStatistics', function () {
		it('works', function () {
			assert.deepStrictEqual(
				statistics.setClassesMinMaxFromStatistics([2, 4, 6, 8], {
					min: 0,
					max: 10,
				}),
				[0, 4, 6, 10]
			);
		});
	});
});
