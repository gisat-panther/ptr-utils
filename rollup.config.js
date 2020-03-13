import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";

const env = process.env.NODE_ENV;
const pkg = require("./package.json");

const lodashExternal = [
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
  'lodash/forIn',
]

export default {
  input: "src/index.js",
  external: [
    'isomorphic-fetch',
    '@turf/turf',
    're-reselect',
    'chroma-js',
    'moment',
    ...lodashExternal
  ],
  output: {
    file: {
      es: pkg.module,
      cjs: pkg.main
    }[env],
    format: env,
    globals: {
      // 'lodash/random': '_.random'
    },
    exports: 'named', /** Disable warning for default imports */
    sourcemap: true,
  },
  plugins: [
    babel({
      plugins: ["lodash"],
    }),
    commonjs({
        include: 'node_modules/**',
    }),
    filesize(),
  ]
};