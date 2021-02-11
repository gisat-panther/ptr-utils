const countDecimals = value =>
	value % 1 ? value.toString().split('.')[1].length : 0;

const round = (number, decimals) => {
	const roundDecimals = Math.pow(10, decimals);
	return Math.round(number * roundDecimals) / roundDecimals;
};

//7 -> 7.1 ok
//8.78 -> 8.79 ??
const roundHigher = (number, decimals) => {
	const base = round(number, decimals);

	//add last decimal
	const baseDecimals = countDecimals(base) || 1;
	// const roundDecimals = Math.pow(10, baseDecimals);
	const higherDecimals = Math.pow(10, baseDecimals + 1);
	const addition = Math.round(1 * 10) / higherDecimals;
	return round(base + addition, decimals);
};

const degToRadians = deg => {
	return (Math.PI * deg) / 180;
};

const radiansToDeg = rad => {
	return (180 * rad) / Math.PI;
};

export default {
	countDecimals,
	degToRadians,
	radiansToDeg,
	round,
	roundHigher,
};
