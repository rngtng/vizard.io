var webpack = require('webpack');
var ExtractPlugin = require('extract-text-webpack-plugin');

var extract_html = new ExtractPlugin('index.html')
var extract_css = new ExtractPlugin('style.html')

module.exports = {
    entry: "./main.js",
    output: {
        path: 'dist',
        filename: "bundle.js"
    },
    plugins: [
        extract_html,
        extract_css
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
            loader: extract_html.extract('html', 'html?attrs=false')
          },
          {
            test: /\.css$/,
            loader: extract_css.extract('style', 'css')
          }
        ]
    }
};
