import {assert} from 'chai';

import {
    // getLocationFromPlaceString, //todo
	mergeLayers,
	// resetHeading, //todo
} from '../../src/map';

describe('mergeLayers', function () {

	it('mergeLayers', function () {

        const layers1 = ["coffe", "bananna", "tea"];
        const layers2 = ["car", "bananna", "house"];

        assert.deepEqual(mergeLayers(layers1, layers2), ["coffe", "bananna", "tea", "car", "bananna", "house"]);
        assert.deepEqual(mergeLayers(layers1), ["coffe", "bananna", "tea"]);
        assert.deepEqual(mergeLayers(), null);
    });
    
	it('mergeLayers', function () {

        const layers1 = ["coffe", "bananna", "tea"];
        const layers2 = ["car", "bananna", "house"];

        assert.deepEqual(mergeLayers(layers1, layers2), ["coffe", "bananna", "tea", "car", "bananna", "house"]);
        assert.deepEqual(mergeLayers(layers1), ["coffe", "bananna", "tea"]);
        assert.deepEqual(mergeLayers(), null);
	});
});
