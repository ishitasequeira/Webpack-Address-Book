const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let outDirectory = path.resolve(__dirname, 'dist');
let outputFilename = '[name].js';

module.exports = {
    mode: 'production',
    entry: './src/main.js',
    output: {
        filename: outputFilename,
        path: outDirectory,
        publicPath: '/'
    },
    devServer: {
        port: 3002,
        contentBase: outDirectory,
        open:true,
        openPage: './index.html'
    },
    resolve: {
        alias: {
            Root: path.resolve(__dirname, 'src/'),
            SCSS: path.resolve(__dirname, 'scss/')
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }]
        }, {
            test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../'
                }
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]


        },
        {
            test: /\.(png|jpg|gif)$/i,
            loader: 'file-loader',
            options: {
                name: 'images/[name].[ext]',
                publicPath: '/'
            }
        }]
    }

};