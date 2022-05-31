import {describe, it} from 'mocha';
import {assert} from 'chai';
import sort from '../src/sort';

describe('sort', function () {
	describe('sortByOrder', function () {
		const tests = [
			{
				name: 'user asc, age desc',
				data: [
					{user: 'fred', age: 48},
					{user: 'barney', age: 34},
					{user: 'fred', age: 40},
					{user: 'barney', age: 36},
				],
				order: [
					['user', 'asc'],
					['age', 'desc'],
				],
				expectedResult: [
					{user: 'barney', age: 36},
					{user: 'barney', age: 34},
					{user: 'fred', age: 48},
					{user: 'fred', age: 40},
				],
			},
			{
				name: 'user desc, age asc',
				data: [
					{user: 'fred', age: 48},
					{user: 'barney', age: 34},
					{user: 'fred', age: 40},
					{user: 'barney', age: 36},
				],
				order: [
					['user', 'desc'],
					['age', 'asc'],
				],
				expectedResult: [
					{user: 'fred', age: 40},
					{user: 'fred', age: 48},
					{user: 'barney', age: 34},
					{user: 'barney', age: 36},
				],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					sort.sortByOrder(test.data, test.order),
					test.expectedResult
				);
			});
		});
	});
});
