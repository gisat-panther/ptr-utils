import {assert} from 'chai';
import utils from '../../src/utils';

describe('utils/getRemSize', function () {
	it('Return default font size', function () {
		assert.equal(utils.getRemSize(), 16);
	});
});
