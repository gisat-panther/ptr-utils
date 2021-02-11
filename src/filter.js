import _ from 'lodash';

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
		const withoutNullValues = _.map(data, item => {
			const data = _.get(item, serieSourcePath);
			const filteredData = filterData(data, valueSourcePaths);
			return _.set({...item}, serieSourcePath, filteredData);
		});

		return _.filter(withoutNullValues, item => {
			const data = _.get(item, serieSourcePath);
			return data && data.length !== 0;
		});
	}
}

function isNull(val) {
	return !val && val !== 0;
}

function filterData(data, valueSourcePaths, allValuesNull) {
	return _.filter(data, item => {
		if (_.isArray(valueSourcePaths)) {
			const nullN = allValuesNull ? _.every : _.some;

			return !nullN(valueSourcePaths, path => isNull(_.get(item, path)));
		} else {
			return !isNull(_.get(item, valueSourcePaths));
		}
	});
}

export default {
	filterDataWithNullValue,
};
