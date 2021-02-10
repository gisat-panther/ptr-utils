import {assert} from 'chai';
import legend from '../src/legend';

describe('legend', function () {
	describe('getIntervalTitle', function () {
		const tests = [
			{
				name: 'integers first',
				interval: [0, 9],
				first: true,
				expectedResult: '0 - 9',
			},
			{
				name: 'integers non first',
				interval: [0, 9],
				first: false,
				expectedResult: `${(0.1).toLocaleString()} - 9`,
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.strictEqual(
					legend.getIntervalTitle(test.interval, test.first),
					test.expectedResult
				);
			});
		});
	});
});
