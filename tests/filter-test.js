import {assert} from 'chai';
import filter from '../src/filter';

describe('filter-test', function () {
	describe('filterDataWithNullValue', function () {
		const tests = [
			{
				name: 'test object with string path and all values non null',
				data: [
					{
						testProp: 0,
					},
					{
						testProp: 1,
					},
					{
						testProp: null,
					},
					{
						testProp: undefined,
					},
					{
						testProp: '',
					},
				],
				valueSourcePaths: 'testProp',
				serieSourcePath: null,
				allValuesNull: false,
				expectedValue: [
					{
						testProp: 0,
					},
					{
						testProp: 1,
					},
				],
			},
			{
				name: 'test object with string path and all values null',
				data: [
					{
						testProp: 0,
					},
					{
						testProp: 1,
					},
					{
						testProp: null,
					},
					{
						testProp: undefined,
					},
					{
						testProp: '',
					},
				],
				valueSourcePaths: 'testProp',
				serieSourcePath: null,
				allValuesNull: true,
				expectedValue: [
					{
						testProp: 0,
					},
					{
						testProp: 1,
					},
				],
			},
			{
				name: 'test object with array path and all values non null',
				data: [
					{
						testProp: 0,
						testProp2: null,
					},
					{
						testProp: 1,
						testProp2: 1,
					},
					{
						testProp: null,
						testProp2: 9,
					},
					{
						testProp: undefined,
						testProp2: null,
					},
					{
						testProp: '',
						testProp2: undefined,
					},
				],
				valueSourcePaths: ['testProp', 'testProp2'],
				serieSourcePath: null,
				allValuesNull: false,
				expectedValue: [
					{
						testProp: 1,
						testProp2: 1,
					},
				],
			},
			{
				name: 'test object with array path and all values null',
				data: [
					{
						testProp: 0,
						testProp2: null,
					},
					{
						testProp: 1,
						testProp2: 1,
					},
					{
						testProp: null,
						testProp2: 9,
					},
					{
						testProp: undefined,
						testProp2: null,
					},
					{
						testProp: '',
						testProp2: undefined,
					},
				],
				valueSourcePaths: ['testProp', 'testProp2'],
				serieSourcePath: null,
				allValuesNull: true,
				expectedValue: [
					{
						testProp: 0,
						testProp2: null,
					},
					{
						testProp: 1,
						testProp2: 1,
					},
					{
						testProp: null,
						testProp2: 9,
					},
				],
			},
			{
				name: 'test object serie with string path and all values non null',
				data: [
					{
						path: [
							{
								testProp: 0,
							},
							{
								testProp: 1,
							},
							{
								testProp: null,
							},
							{
								testProp: undefined,
							},
							{
								testProp: '',
							},
						],
					},
					{
						path: [
							{
								testProp: null,
							},
							{
								testProp: undefined,
							},
							{
								testProp: '',
							},
						],
					},
				],
				valueSourcePaths: 'testProp',
				serieSourcePath: 'path',
				allValuesNull: false,
				expectedValue: [
					{
						path: [
							{
								testProp: 0,
							},
							{
								testProp: 1,
							},
						],
					},
				],
			},
			{
				name: 'test object serie with string path and all values null',
				data: [
					{
						path: [
							{
								testProp: 0,
							},
							{
								testProp: 1,
							},
							{
								testProp: null,
							},
							{
								testProp: undefined,
							},
							{
								testProp: '',
							},
						],
					},
				],
				valueSourcePaths: 'testProp',
				serieSourcePath: 'path',
				allValuesNull: true,
				expectedValue: [
					{
						path: [
							{
								testProp: 0,
							},
							{
								testProp: 1,
							},
						],
					},
				],
			},
		];
		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					filter.filterDataWithNullValue(
						test.data,
						test.valueSourcePaths,
						test.serieSourcePath,
						test.allValuesNull
					),
					test.expectedValue
				);
			});
		});
	});
});
