import {describe, it} from 'mocha';
import {assert} from 'chai';
import CacheFifo from '../src/CacheFifo';

describe('CacheFifo', function () {
	const maxSize = 2;
	const cache = new CacheFifo(maxSize);

	it('empty', function () {
		assert.strictEqual(cache.size(), 0);
		assert.notExists(cache.first());
		assert.notExists(cache.last());
		assert.strictEqual(cache.findIndexByKey(1), -1);
		assert.notExists(cache.findByKey(1));
	});

	it('add first item', function () {
		cache.add({cacheKey: 1});
		assert.strictEqual(cache.size(), 1);
		assert.deepStrictEqual(cache.first(), {cacheKey: 1});
		assert.deepStrictEqual(cache.last(), {cacheKey: 1});
		assert.strictEqual(cache.findIndexByKey(1), 0);
		assert.deepStrictEqual(cache.findByKey(1), {cacheKey: 1});
	});

	it('add second item', function () {
		cache.add({cacheKey: 2});
		assert.strictEqual(cache.size(), 2);
		assert.deepStrictEqual(cache.first(), {cacheKey: 1});
		assert.deepStrictEqual(cache.last(), {cacheKey: 2});
		assert.strictEqual(cache.findIndexByKey(1), 0);
		assert.strictEqual(cache.findIndexByKey(2), 1);
		assert.deepStrictEqual(cache.findByKey(1), {cacheKey: 1});
		assert.deepStrictEqual(cache.findByKey(2), {cacheKey: 2});
	});

	it('add third (overflow) item', function () {
		cache.add({cacheKey: 3});
		assert.strictEqual(cache.size(), 2);
		assert.deepStrictEqual(cache.first(), {cacheKey: 2});
		assert.deepStrictEqual(cache.last(), {cacheKey: 3});
		assert.strictEqual(cache.findIndexByKey(1), -1);
		assert.strictEqual(cache.findIndexByKey(2), 0);
		assert.strictEqual(cache.findIndexByKey(3), 1);
		assert.notExists(cache.findByKey(1));
		assert.deepStrictEqual(cache.findByKey(2), {cacheKey: 2});
		assert.deepStrictEqual(cache.findByKey(3), {cacheKey: 3});
	});

	it('remove item', function () {
		cache.remove();
		assert.strictEqual(cache.size(), 1);
		assert.deepStrictEqual(cache.first(), {cacheKey: 3});
		assert.deepStrictEqual(cache.last(), {cacheKey: 3});
	});

	it('replace item 3 using addOrUpdate', function () {
		cache.addOrUpdate({cacheKey: 3, val: 4});
		assert.strictEqual(cache.size(), 1);
		assert.deepStrictEqual(cache.first(), {cacheKey: 3, val: 4});
		assert.deepStrictEqual(cache.last(), {cacheKey: 3, val: 4});
	});

	it('add item 4 using addOrUpdate', function () {
		cache.addOrUpdate({cacheKey: 4, val: 4});
		assert.strictEqual(cache.size(), 2);
		assert.deepStrictEqual(cache.first(), {cacheKey: 3, val: 4});
		assert.deepStrictEqual(cache.last(), {cacheKey: 4, val: 4});
	});
});
