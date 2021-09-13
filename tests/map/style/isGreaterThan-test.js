import {assert} from 'chai';
import style from '../../../src/map/style';

describe('isGreaterThan', function () {
	it('given value is greater than reference', function () {
		const value = 0.75;
		const reference = 0.74;

		const output = style.isGreaterThan(value, reference);

		assert.isTrue(output);
	});

	it('given value is greater than reference or equal', function () {
		const value = 0.75;
		const reference = 0.75;

		const output = style.isGreaterThan(value, reference, true);

		assert.isTrue(output);
	});

	it('given value is not greater than reference or equal', function () {
		const value = 0.75;
		const reference = 0.75;

		const output = style.isGreaterThan(value, reference, false);

		assert.isFalse(output);
	});

	it('given value is not greater than reference', function () {
		const value = 0.75;
		const reference = 0.76;

		const output = style.isGreaterThan(value, reference);

		assert.isFalse(output);
	});

	it('no value given', function () {
		const reference = 0.76;

		const output = style.isGreaterThan(undefined, reference);

		assert.isFalse(output);
	});
});
