const removeItemByIndex = (array, index) => [
	...array.slice(0, index),
	...array.slice(index + 1),
];
const addItemToIndex = (array, index, item) => [
	...array.slice(0, index),
	item,
	...array.slice(index),
];
const addItem = (array, item) => [...array, item];
const replaceItemOnIndex = (array, index, item) => [
	...array.slice(0, index),
	item,
	...array.slice(index + 1),
];
const removeItemByKey = (object, key) => {
	// eslint-disable-next-line no-unused-vars
	const {[key]: value, ...withoutKey} = object;
	return withoutKey;
};

export default {
	addItem,
	addItemToIndex,
	removeItemByIndex,
	removeItemByKey,
	replaceItemOnIndex,
};
