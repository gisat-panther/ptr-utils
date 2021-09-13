import {assert} from 'chai';
import style from '../../../src/map/style';

describe('doMathOperations', function () {
	it('convert value to positive', function () {
		const value = -3;
		const operations = ['abs'];
		const output = style.doMathOperations(operations, value);
		const expectedOutput = 3;

		assert.equal(output, expectedOutput);
	});

	it('convert value to -1', function () {
		const value = -3;
		const operations = ['sign'];
		const output = style.doMathOperations(operations, value);
		const expectedOutput = -1;

		assert.equal(output, expectedOutput);
	});

	it('convert value to 1', function () {
		const value = -3;
		const operations = ['abs', 'sign'];
		const output = style.doMathOperations(operations, value);
		const expectedOutput = 1;

		assert.equal(output, expectedOutput);
	});

	it('do nothing if operation was not found', function () {
		const value = -3;
		const operations = ['undefinedOperation'];
		const output = style.doMathOperations(operations, value);

		assert.equal(output, value);
	});
});
