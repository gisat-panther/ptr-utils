import {assert} from 'chai';
import models from '../src/models';

describe('models', function () {
	describe('filterScopesByUrl', function () {
		const tests = [
			{
				name: 'empty scopes',
				scopes: [],
				url: 'http://example.com',
				expectedResult: [],
			},
			{
				name: 'matching scope',
				scopes: [{urls: ['http://example2.com', 'http://example.com']}],
				url: 'http://example.com',
				expectedResult: [{urls: ['http://example2.com', 'http://example.com']}],
			},
			{
				name: 'matching scope2',
				scopes: [
					{urls: ['http://example3.com', 'http://example4.com']},
					{urls: ['http://example2.com', 'http://example.com']},
					{urls: ['http://example5.com', 'http://example9.com']},
					{urls: ['http://example3.com', 'http://example.com']},
				],
				url: 'http://example.com',
				expectedResult: [
					{urls: ['http://example2.com', 'http://example.com']},
					{urls: ['http://example3.com', 'http://example.com']},
				],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					models.filterScopesByUrl(test.scopes, test.url),
					test.expectedResult
				);
			});
		});
	});
});
