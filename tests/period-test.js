import {assert} from 'chai';
import period from '../src/period';
import moment from 'moment';

const setTZ = require('set-tz');
setTZ('UTC');

function unmomentPeriod(period) {
	if (period == null) {
		return period;
	}

	return Object.assign({}, period, {
		start: period.start.toISOString(),
		end: period.end.toISOString(),
	});
}

function momentPeriod(period) {
	if (period == null) {
		return period;
	}

	return Object.assign({}, period, {
		start: moment(period.start),
		end: moment(period.end),
	});
}

describe('period', function () {
	describe('parse', function () {
		const tests = [
			{
				name: 'invalid',
				string: 'wth',
				expectedResult: undefined,
			},
			{
				name: 'year',
				string: '2000',
				expectedResult: {
					source: '2000',
					type: 'year',
					start: '2000-01-01T00:00:00.000Z',
					end: '2000-12-31T23:59:59.999Z',
				},
			},
			{
				name: 'month',
				string: '2000-05',
				expectedResult: {
					source: '2000-05',
					type: 'month',
					start: '2000-05-01T00:00:00.000Z',
					end: '2000-05-31T23:59:59.999Z',
				},
			},
			{
				name: 'day',
				string: '2000-05-03',
				expectedResult: {
					source: '2000-05-03',
					type: 'day',
					start: '2000-05-03T00:00:00.000Z',
					end: '2000-05-03T23:59:59.999Z',
				},
			},
			{
				name: 'hour',
				string: '2000-05-03T06',
				expectedResult: {
					source: '2000-05-03T06',
					type: 'hour',
					start: '2000-05-03T06:00:00.000Z',
					end: '2000-05-03T06:59:59.999Z',
				},
			},
			{
				name: 'minute',
				string: '2000-05-03T06:03',
				expectedResult: {
					source: '2000-05-03T06:03',
					type: 'minute',
					start: '2000-05-03T06:03:00.000Z',
					end: '2000-05-03T06:03:59.999Z',
				},
			},
			{
				name: 'second',
				string: '2000-05-03T06:03:11',
				expectedResult: {
					source: '2000-05-03T06:03:11',
					type: 'second',
					start: '2000-05-03T06:03:11.000Z',
					end: '2000-05-03T06:03:11.999Z',
				},
			},
			{
				name: 'second without dashes and colons',
				string: '20000503T060311',
				expectedResult: {
					source: '20000503T060311',
					type: 'second',
					start: '2000-05-03T06:03:11.000Z',
					end: '2000-05-03T06:03:11.999Z',
				},
			},
			{
				name: 'full',
				string: '2000-05-03T06:03:11.222Z',
				expectedResult: {
					source: '2000-05-03T06:03:11.222Z',
					type: 'full',
					start: '2000-05-03T06:03:11.222Z',
					end: '2000-05-03T06:03:11.999Z',
				},
			},
			{
				name: 'mixed interval',
				string: '2020/2020-06',
				expectedResult: {
					type: 'interval',
					start: '2020-01-01T00:00:00.000Z',
					end: '2020-06-30T23:59:59.999Z',
				},
			},
		];

		tests.forEach((test) => {
			it(test.name, function () {
				assert.deepStrictEqual(
					unmomentPeriod(period.parse(test.string)),
					test.expectedResult
				);
			});
		});
	});

	describe('toString', function () {
		const tests = [
			{
				name: 'year',
				period: {
					source: '2000',
					type: 'year',
					start: '2000-01-01T00:00:00.000Z',
					end: '2000-12-31T23:59:59.999Z',
				},
				expectedResult: '2000',
			},
			{
				name: 'month',
				period: {
					source: '2000-05',
					type: 'month',
					start: '2000-05-01T00:00:00.000Z',
					end: '2000-05-31T23:59:59.999Z',
				},
				expectedResult: '2000-05',
			},
			{
				name: 'day',
				period: {
					source: '2000-05-03',
					type: 'day',
					start: '2000-05-03T00:00:00.000Z',
					end: '2000-05-03T23:59:59.999Z',
				},
				expectedResult: '2000-05-03',
			},
			{
				name: 'hour',
				period: {
					source: '2000-05-03T06',
					type: 'hour',
					start: '2000-05-03T06:00:00.000Z',
					end: '2000-05-03T06:59:59.999Z',
				},
				expectedResult: '2000-05-03 6h',
			},
			{
				name: 'minute',
				period: {
					source: '2000-05-03T06:03',
					type: 'minute',
					start: '2000-05-03T06:03:00.000Z',
					end: '2000-05-03T06:03:59.999Z',
				},
				expectedResult: '2000-05-03 6:03',
			},
			{
				name: 'second',
				period: {
					source: '2000-05-03T06:03:11',
					type: 'second',
					start: '2000-05-03T06:03:11.000Z',
					end: '2000-05-03T06:03:11.999Z',
				},
				expectedResult: '2000-05-03 6:03:11',
			},
			{
				name: 'second without dashes and colons',
				period: {
					source: '20000503T060311',
					type: 'second',
					start: '2000-05-03T06:03:11.000Z',
					end: '2000-05-03T06:03:11.999Z',
				},
				expectedResult: '2000-05-03 6:03:11',
			},
			{
				name: 'full',
				period: {
					source: '2000-05-03T06:03:11.222Z',
					type: 'full',
					start: '2000-05-03T06:03:11.222Z',
					end: '2000-05-03T06:03:11.999Z',
				},
				expectedResult: '2000-05-03 6:03:11',
			},
			{
				name: 'mixed interval',
				period: {
					type: 'interval',
					start: '2020-01-01T00:00:00.000Z',
					end: '2020-06-30T23:59:59.999Z',
				},
				expectedResult: '2020-01-01 12:00:00 - 2020-06-30 11:59:59',
			},
		];

		tests.forEach((test) => {
			it(test.name, function () {
				assert.strictEqual(
					period.toString(momentPeriod(test.period)),
					test.expectedResult
				);
			});
		});
	});
});
