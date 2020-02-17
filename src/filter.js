import map from 'lodash/map';
import get from 'lodash/get';
import set from 'lodash/set';
import {each, filter, isArray} from 'lodash';

/**
 *
 * @param data {array}
 * @param valueSourcePaths {array}
 * @param serieSourcePath {string}
 * @param allValuesNull {boolean} if true, all values has to be null to filter the item out
 * @return {*}
 */
function filterDataWithNullValue (data, valueSourcePaths, serieSourcePath, allValuesNull) {
	if (!serieSourcePath) {
		return filterData(data, valueSourcePaths, allValuesNull);
	} else {
		let withoutNullValues = map(data, item => {
			let data = get(item, serieSourcePath);
			let filteredData = filterData(data, valueSourcePaths);
			return set({...item}, serieSourcePath, filteredData);
		});

		return filter(withoutNullValues, (item) => {
			let data = get(item, serieSourcePath);
			return data && data.length !== 0;
		});
	}
}

function filterData (data, valueSourcePaths, allValuesNull) {
	return filter(data, (item) => {
		if (isArray(valueSourcePaths)) {
			if (allValuesNull) {
				let unfitFilter = 0;
				each(valueSourcePaths, (path) => {
					let val = get(item, path);
					if (!val && val !==0) {
						unfitFilter++;
					}
				});
				return unfitFilter !== valueSourcePaths.length;
			} else {
				let fitsFilter = true;
				each(valueSourcePaths, (path) => {
					let val = get(item, path);
					if (!val && val !==0) {
						fitsFilter = false
					}
				});
				return fitsFilter;
			}
		} else {
			let val = get(item, valueSourcePaths);
			return val || val === 0;
		}
	});
}

export default {
	filterDataWithNullValue
};