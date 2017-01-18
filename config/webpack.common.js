const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractStyl = new ExtractTextPlugin('[name].css');

console.log(__dirname, 'src');

const config = {
    loaders: {
        eslint: {
            test: /\.js$/,
            loader: 'eslint',
            include: path.join(__dirname, '../src'),
        },
        babel: {
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/
        },
        stylus: {
            develop: {
                test: /\.styl$/,
                loaders: ['style', 'css', 'stylus'],
            },
            production: {
                test: /\.styl/,
                loader: ExtractStyl.extract(['css', 'stylus'])
            }
        }
    },

    plugins: {
        html: {
            develop: new HtmlWebpackPlugin({
                title: 'SpaceInvadersRx',
                template: 'src/index.html',
                inject: 'body',
                cache: true,
                ENV: 'develop'
            }),
            production: new HtmlWebpackPlugin({
                title: 'SpaceInvadersRx',
                template: 'src/index.html',
                ENV: 'production'
            })
        },

        define: {
            develop: new webpack.DefinePlugin({
                'ENV': JSON.stringify('develop')
            }),
            production: new webpack.DefinePlugin({
                'ENV': JSON.stringify('production'),
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        },

        css: ExtractStyl,

        hot: new webpack.HotModuleReplacementPlugin({
            multiStep: true
        }),

        // uglify: new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     output: {
        //         comments: false
        //     },
        //     sourceMap: false
        // })
    }
};

module.exports = config;
