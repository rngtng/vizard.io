var webpack = require('webpack');
var ExtractPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: "./main.js",
    output: {
        path: 'dist',
        filename: "bundle.js"
    },
    plugins: [
        new ExtractPlugin('index.html')
        // new webpack.optimize.CommonsChunkPlugin({
        //     name:      'main', // Move dependencies to our main file
        //     children:  true, // Look for common dependencies in all children,
        //     minChunks: 2, // How many times a dependency must come up before being extracted
        // }),
    ],
    module: {
        loaders: [
          {
            test: /\.html$/,
            loader: ExtractPlugin.extract('html', 'html')
          }
          // ,
          // {
          //   test: /\.css$/,
          //   loader: ExtractPlugin.extract('style', 'html')
          // }
        ]
    }
};
