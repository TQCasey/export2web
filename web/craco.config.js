
const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outname = "dist";
const outputDir = path.resolve(__dirname, '' + outname);

const IndexHtml = path.resolve(__dirname, 'public', 'index.html');
const DestIndexHtml = path.resolve(outputDir, 'index.html');

const fs = require ("fs")

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
        mode : "development",
        

        configure: (webpackConfig, { env, paths }) => {

            // console.log (webpackConfig);

            if (env == "production") {
                fs.writeFileSync (path.resolve (__dirname,"src","AppConfig.js"),
'\nmodule.exports = {\n\
    url_pre : "",\n\
}\n\
                ');

            } else {

                fs.writeFileSync (path.resolve (__dirname,"src","AppConfig.js"),
'\nmodule.exports = {\n\
    url_pre : "http://localhost:8000",\n\
}\n\
                ');
            }


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

            console.log (env);

            webpackConfig.plugins = [
                new MiniCssExtractPlugin({
                    // filename: "css/[name].[fullhash:8].css", // change this RELATIVE to your output.path!
                    filename: "css/[name].css", // change this RELATIVE to your output.path!
                })
                ,
            ];

            if (env == "production") {
                webpackConfig.plugins.push (
                    new CopyWebpackPlugin ({
                        patterns : [
                            {
                                from : path.resolve (__dirname,"public","dist-index.html"),
                                to : path.resolve (outputDir,"index.html"),
                            }
                        ]
                    })
                )
                
            } else {
                webpackConfig.plugins.push (
                    new HtmlWebpackPlugin({
                        filename: DestIndexHtml,
                        chunks: [
                            'main',
                        ],
                        template: IndexHtml,
                        inject: "body",
                        // meta : 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=0, charset=utf-8',
                        minify: {
                            caseSensitive: false,
                            collapseBooleanAttributes: true,
                            collapseWhitespace: true
                        },
                    })
                );
            }

            // webpackConfig.module.rules = [
            //     cssLoaderConfiguration,
            //     scssLoaderConfiguration,   
            // ]

            return webpackConfig
        }
    }
}
