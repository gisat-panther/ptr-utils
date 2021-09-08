import {assert} from 'chai';
import style from '../../../src/map/style';

describe('scaleValue', function () {
	it('scale value from input range according to output range', function () {
		const inputRange = [0, 1];
		const outputRange = [0, 2];
		const value = 0.75;
		const expectedOutput = 1.5;
		const output = style.scaleValue(inputRange, outputRange, value);

		assert.equal(output, expectedOutput);
	});

	it('scale value from input range according to output range 2', function () {
		const inputRange = [-1, 1];
		const outputRange = [0, 2];
		const value = 0.5;
		const expectedOutput = 1.5;
		const output = style.scaleValue(inputRange, outputRange, value);

		assert.equal(output, expectedOutput);
	});

	it('scale value from input range according to output range 3', function () {
		const inputRange = [-1, 1];
		const outputRange = [0, 10];
		const value = -0.5;
		const expectedOutput = 2.5;
		const output = style.scaleValue(inputRange, outputRange, value);

		assert.equal(output, expectedOutput);
	});

	it('throw Error if value is out of input range', function () {
		const inputRange = [-1, 1];
		const outputRange = [0, 10];
		const value = -2;

		assert.throw(
			style.scaleValue.bind(this, inputRange, outputRange, value),
			'map/style#scaleValue: Given value is out of input range!'
		);
	});
});
