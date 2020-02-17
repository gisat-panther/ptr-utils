var path = require('path');
module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    externals: {
        "lodash": "lodash",
        "chroma-js": "chroma-js",
        "isomorphic-fetch": "isomorphic-fetch",
        "reselect": "reselect",
        "re-reselect": "re-reselect"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            }
        ]
    }
};