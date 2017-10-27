var webpack = require('webpack');

module.exports = {
	entry: [
		'./public/m-src/index.js'
	],
	output: {
		path: __dirname + '/public/m-build/',
		filename: 'create.min.js'
	},
	watch: true,
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.hbs$/, loader: "handlebars" }
		]
	},
	resolve: {
		root: 'D:/nodejs/home/h5-zhuanti-expand/public',   //绝对路径
		extensions: ['', '.js', '.json'],   //自动扩展文件后缀名（require可以省略后缀名）
	},
	//插件项
	// plugins: [
	// 	new webpack.ProvidePlugin({
    //         $: "jquery"
    //     })
	// ]
};