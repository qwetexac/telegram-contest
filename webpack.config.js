const path = require('path')
const glob = require('glob')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const babelConfig = require('./.babelrc')

const isDevelopmentMode = process.env.NODE_ENV === 'development'

const __JSLoader__ = {
	test : /\.js$/,
	use  : {
		loader  : 'babel-loader',
		options : {
			babelrc : false,
			...babelConfig,
			plugins : babelConfig.plugins
		}
	}
}

const __StyleLoader__ = {
	test : /\.s(a|c)ss|.css$/,
	use  : ExtractTextPlugin.extract({
		fallback : 'style-loader',
		use      : [
			'css-loader',
			'resolve-url-loader',
			{
				loader  : 'sass-loader',
				options : {
					includePaths : ['styles']
						.map(d => path.join(__dirname, d))
						.map(g => glob.sync(g))
						.reduce((a, c) => a.concat(c), [])
				}
			}
		]
	})
}


module.exports = {
	mode    : process.env.NODE_ENV,
	devtool : isDevelopmentMode && 'eval',
	entry   : './src/index.js',
	output  : {
		path       : path.resolve(__dirname, 'public'),
		filename   : 'chart.js',
		publicPath : '/',
	},
	stats   : {
		colors       : true,
		modules      : true,
		reasons      : true,
		errorDetails : true
	},
	
	watch : isDevelopmentMode,
	
	resolve : {
		extensions : ['.js', '.json'],
		modules    : ['src', 'node_modules', 'public'],
		symlinks   : false
	},
	
	devServer : {
		hot                : true,
		inline             : true,
		open               : true,
		contentBase        : __dirname,
		historyApiFallback : true,
		port               : 8090
	},
	
	module : {
		rules : [
			__JSLoader__,
			__StyleLoader__,
			{
				test  : /\.svg$/,
				loader : 'url-loader'
			}
		]
		
	},
	
	optimization : {
		minimize : ! isDevelopmentMode,
		minimizer: [new UglifyJsPlugin()],
	},
	
	plugins : [
		new ExtractTextPlugin({
			filename : 'main.css',
			disable  : isDevelopmentMode
		})
	]
}
