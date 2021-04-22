import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import {visualizer} from 'rollup-plugin-visualizer';

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

const lodashExternal = [
	'lodash/cloneDeep',
	'lodash/find',
	'lodash/findIndex',
	'lodash/each',
	'lodash/isArray',
	'lodash/filter',
	'lodash/set',
	'lodash/get',
	'lodash/map',
	'lodash/isObject',
	'lodash/orderBy',
	'lodash/isNumber',
	'lodash/mapValues',
	'lodash/isObjectLike',
	'lodash/objectLike',
	'lodash/forIn',
	'lodash/every',
	'lodash/some',
];

export default {
	input: 'src/index.js',
	external: [
		'isomorphic-fetch',
		'@turf/bbox',
		'@turf/center',
		're-reselect',
		'chroma-js',
		'moment',
		'@gisatcz/ptr-core',
		/@babel\/runtime/,
		...lodashExternal,
	],
	output: {
		file: {
			es: pkg.module,
			cjs: pkg.main,
		}[env],
		format: env,
		globals: {
			// 'lodash/random': '_.random'
		},
		exports: 'named' /** Disable warning for default imports */,
		sourcemap: true,
	},
	plugins: [
		babel({
			plugins: ['lodash'],
			babelHelpers: 'runtime',
		}),
		commonjs({
			include: 'node_modules/**',
		}),
		filesize(),
		visualizer(),
	],
	onwarn: function (warning, handler) {
		if (/external dependency/.test(warning)) {
			throw new Error(warning);
		}
		handler(warning);
	},
};
