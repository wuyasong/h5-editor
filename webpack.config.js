var webpack = require('webpack');

module.exports = {
	entry: [
		'./src/ppt-src/main.js'
	],
	output: {
		path: __dirname + '/public/dist/',
		filename: 'create.ppt.min.js'  // test
		// filename: 'create_[chunkhash:8].ppt.min.js'  // product
	},
	watch: true,
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{
				test: /\.tpl$/,
				loader: "tmod",
				query: {
					// 编译输出目录设置
					output: "./src/ppt-src/views",

					// 设置输出的运行时路径
					runtime: "./src/ppt-src/lib/template.js",

					// 定义模板采用哪种语法，内置可选：
					// simple: 默认语法，易于读写。可参看语法文档
					// native: 功能丰富，灵活多变。语法类似微型模板引擎 tmpl
					syntax: "simple",

					// 模板文件后缀
					suffix: '.tpl'
				} 
			}
		]
	},
	resolve: {
		root: 'D:/nodejs/home/h5-editor/public',   //绝对路径
		extensions: ['', '.js', '.json']   //自动扩展文件后缀名（require可以省略后缀名）
	}
};