import {orderBy} from 'lodash';

function sortByOrder (data, order) {
	let keys = order.map(rule => rule[0]);
	let orders = order.map(rule => rule[1]);
	return orderBy(data, keys, orders);
}

export default {
	sortByOrder
};