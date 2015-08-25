var path = require('path')
var merge = require('webpack-merge')
var webpack = require('webpack')
var pkg = require('./package.json')
var Clean = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlwebpackPlugin = require('html-webpack-plugin')

var ROOT_PATH = path.resolve(__dirname)

var common = {
  entry: path.resolve(ROOT_PATH, 'app/main'),
  resolve: {
  	extensions: ['','.js','.jsx']
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Kanban app'
    })
  ]
}

var TARGET = process.env.TARGET
if (TARGET === 'dev'){
	module.exports = merge( common , {
		devtool: 'eval',
		module:{
      preLoaders: [
        {
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          include: path.resolve(ROOT_PATH, 'app')
        }
      ],
			loaders:[
        {
          test: /\.css$/,
          loaders: ['style','css'],
          include: path.resolve(ROOT_PATH, 'app')
        },
			  {
			  	test:/\.jsx?$/,
			  	loaders:['react-hot','babel?stage=1'],
			  	include: path.resolve(ROOT_PATH, 'app')
			  }
			]
		}
	})
}
if(TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      app: path.resolve(ROOT_PATH, 'app/main'),
      vendor: Object.keys(pkg.dependencies)
    },
    output: {
      path: path.resolve(ROOT_PATH, 'build'),
      filename: 'app.[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: path.resolve(ROOT_PATH, 'app')
        },
        {
          test: /\.jsx?$/,
          loaders: ['babel?stage=1'],
          include: path.resolve(ROOT_PATH, 'app')
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
      new Clean(['build']),
      new webpack.optimize.CommonsChunkPlugin(
        'vendor',
        'vendor.[chunkhash].js'
      ),
      new webpack.DefinePlugin({
        'process.env': {
          // This affects react lib size
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  })
}