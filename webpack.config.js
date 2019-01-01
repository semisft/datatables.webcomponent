const TerserPlugin = require('terser-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: './index.js',
    },
    mode: 'production',
    resolve: {
        extensions: [".js", ".ts"]
    },
    mode: 'production',
    devtool: 'source-map',

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
    },

    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"},
            {
                test: /\.css$/,
                use: [
                    {loader: "to-string-loader"},
                    {loader: "css-loader"}
                ]
            },
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin({
        //         analyzerMode: 'server',
        //         generateStatsFile: true,
        //         statsOptions: {source: false}
        //     }
        // ),
    ],
    watchOptions: {}
};