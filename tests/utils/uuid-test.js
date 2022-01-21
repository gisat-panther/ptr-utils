import {assert} from 'chai';
import utils from '../../src/utils';

describe('utils/uuid', function () {
	it('Get valid uuid v4', function () {
		let i = 0;
		while (i < 100000) {
			const uuid = utils.uuid();
			//test uuid validity
			assert.isTrue(utils.isValidUuidV4(uuid));
			i++;
		}
	});
});
