import {
	map as _map,
	set as _set,
	filter as _filter,
	isArray as _isArray,
	get as _get,
	some as _some,
	every as _every,
} from 'lodash';

/**
 *
 * @param data {array}
 * @param valueSourcePaths {array|string}
 * @param serieSourcePath {string}
 * @param allValuesNull {boolean} if true, all values has to be null to filter the item out
 * @return {*}
 */
function filterDataWithNullValue(
	data,
	valueSourcePaths,
	serieSourcePath,
	allValuesNull
) {
	if (!serieSourcePath) {
		return filterData(data, valueSourcePaths, allValuesNull);
	} else {
		const withoutNullValues = _map(data, item => {
			const data = _get(item, serieSourcePath);
			const filteredData = filterData(data, valueSourcePaths);
			return _set({...item}, serieSourcePath, filteredData);
		});

		return _filter(withoutNullValues, item => {
			const data = _get(item, serieSourcePath);
			return data && data.length !== 0;
		});
	}
}

function isNull(val) {
	return !val && val !== 0;
}

function filterData(data, valueSourcePaths, allValuesNull) {
	return _filter(data, item => {
		if (_isArray(valueSourcePaths)) {
			const nullN = allValuesNull ? _every : _some;

			return !nullN(valueSourcePaths, path => isNull(_get(item, path)));
		} else {
			return !isNull(_get(item, valueSourcePaths));
		}
	});
}

export default {
	filterDataWithNullValue,
};
