
const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outname = "dist";
const outputDir = path.resolve(__dirname, '' + outname);

const IndexHtml = path.resolve(__dirname, 'public', 'index.html');
const DestIndexHtml = path.resolve(outputDir, 'index.html');

// const cssLoaderConfiguration = {
//     test: /\.css|\.less$/,
//     use: ['style-loader',
//         'css-loader'],
// }

// const scssLoaderConfiguration = {
//     test: /\.scss$/,
//     use: [
//         {
//             loader: "style-loader" 
//         }, 
//         {
//             loader: "css-loader" 
//         }, 
//         {
//             loader: "sass-loader" 
//         }
//     ]
// }

module.exports = {

    webpack: {
        devtool: "source-map",

        configure: (webpackConfig, { env, paths }) => {

            // console.log (webpackConfig);

            // paths.appPath='public'
            paths.appBuild = outname
            webpackConfig.output = {
                // filename: whenDev(() => 'js/bundle.[fullhash:8].js', 'js/[name].[fullhash:8].js'),
                // chunkFilename: 'js/[name].[fullhash:8].js',


                filename: whenDev(() => 'js/bundle.js', 'js/[name].js'),
                chunkFilename: 'js/[name].js',

                path: outputDir, // 修改输出文件目录
                publicPath: '/',
                clean: true,
            };

            webpackConfig.plugins = [
                new MiniCssExtractPlugin({
                    // filename: "css/[name].[fullhash:8].css", // change this RELATIVE to your output.path!
                    filename: "css/[name].css", // change this RELATIVE to your output.path!
                })
                ,
                // new HtmlWebpackPlugin({
                //     filename: DestIndexHtml,
                //     chunks: [
                //         'main',
                //     ],
                //     template: IndexHtml,
                //     inject: "body",
                //     // meta : 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=0, charset=utf-8',
                //     minify: {
                //         caseSensitive: false,
                //         collapseBooleanAttributes: true,
                //         collapseWhitespace: true
                //     },
                // }),

                new CopyWebpackPlugin ({
                    patterns : [
                        {
                            from : path.resolve (__dirname,"public","index.html"),
                            to : outputDir,
                        }
                    ]
                })

            ];

            // webpackConfig.module.rules = [
            //     cssLoaderConfiguration,
            //     scssLoaderConfiguration,   
            // ]

            return webpackConfig
        }
    }
}
