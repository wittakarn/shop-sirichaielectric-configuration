const path = require('path');

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
        chunkFilename: "[name].chunk.js",
        publicPath: "/shop-sirichaielectric-configuration/dist/"
    },
    watch: true,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules'),
        ]
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
        }, ]
    },
};