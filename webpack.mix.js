const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  /*  entry: {
        app: Path.resolve('./src/js/index.js')
    },
    output: {
        path: Path.resolve(__dirname, 'build'),
        filename: 'exascript.js'
    },
	*/
	mode: 'development',
    devtool: 'source-map',
	entry: {
		'mix.js': [
			/* Path.resolve(__dirname, 'node_modules/rainbow-web-sdk/src/vendors-sdk.min.js'), */
			Path.resolve(__dirname, 'app/scripts/app.js'),
		/*	Path.resolve(__dirname, 'app/scripts/controllers/main.js'), */
			Path.resolve(__dirname, 'video/src/concatvideo.js'),
			Path.resolve(__dirname, './copyres.js'),
		]
	},
	output: {
			filename: '[name]',
			path: Path.resolve(__dirname, 'build'),
			publicPath:'../build/'
	},
    optimization: {
        // splitChunks: {
        // chunks: 'all',
        // name: false
        // }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{ from: Path.resolve(__dirname, 'applic/myvendor/'), to: 'vendor_script' }]),
        new HtmlWebpackPlugin({
			inject:true,
            template: Path.resolve(__dirname, 'applic/template', 'index.html')
        })
    ],
    resolve: {
        alias: {
            '~': Path.resolve(__dirname, './')
        },
		
   // modules: [	path.resolve(__dirname, 'node_modules'), 'node_modules'	],		
    },
    devServer: {
		contentBase: [
			Path.join(__dirname, './'),
		//	Path.resolve(__dirname,"node_modules")
		],
		publicPath:  '/build/',
		// contentBase: Path.resolve(__dirname, './src'),
        filename: 'mix.js',
        compress: true,
        headers: {
            'content-type': 'text/html'
        },
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                type: 'javascript/auto'
            },
			{
                test: /\.js$/,
                exclude: Path.resolve(__dirname, './'),
                loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
            },
            {
                test: /\.s?css$/i,
				exclude: /node_modules/,
                use: ['style-loader','css-loader'],
            },
			
			{
				test: /\.html$/,
				exclude: [ /applic/, /node_modules/ ],
				use: [
						{ loader: 'ngtemplate-loader?relativeTo=' + __dirname + '/' },
						{ loader: 'html-loader' }
				]
			},	
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            }
        ]
    }
};
