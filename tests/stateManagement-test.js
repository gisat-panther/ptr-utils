import {assert} from 'chai';
import stateManagement from '../src/stateManagement';

describe('stateManagement', function () {
	it('removeItemByIndex', function () {
		assert.deepStrictEqual(
			stateManagement.removeItemByIndex([1, 2, 3], 1),
			[1, 3]
		);
	});

	it('addItemToIndex', function () {
		assert.deepStrictEqual(
			stateManagement.addItemToIndex([1, 2, 3], 1, 5),
			[1, 5, 2, 3]
		);
	});

	it('addItem', function () {
		assert.deepStrictEqual(stateManagement.addItem([1, 2, 3], 5), [1, 2, 3, 5]);
	});

	it('replaceItemOnIndex', function () {
		assert.deepStrictEqual(
			stateManagement.replaceItemOnIndex([1, 2, 3], 1, 5),
			[1, 5, 3]
		);
	});

	it('removeItemByKey', function () {
		assert.deepStrictEqual(stateManagement.removeItemByKey({a: 1, b: 2}, 'b'), {
			a: 1,
		});
	});
});
