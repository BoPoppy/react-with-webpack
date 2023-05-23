/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

// This line helps Editor suggest all the attributes for the config code below it
// (like using Typescript)
/** @type {(env: any, arg: {mode: string}) => import('webpack').Configuration} **/
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isAnalyze = Boolean(env?.analyze)

  /** @type {import('webpack').Configuration} **/
  const config = {
    // Rules for webpack handling file
    resolve: {
      // Handling file in order from left to right if import
      // file from a same name but with the open tail.
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        // Configure alias for webpack
        // for short import
        // For example: import Login from '@pages/Login'
        // Instead of: import Login from '../pages/Login'
        '@pages': path.resolve(__dirname, './src/pages')
      }
    },
    // entry file for webpack, this file usually for importing other files
    entry: ['./src/index.tsx'],
    // Declare modules using in webpack
    module: {
      rules: [
        {
          test: /\.tsx?$/, // handle files .ts || .tsx
          exclude: /node_modules/,
          use: ['babel-loader'] // translate TS, React to JS,
        },
        {
          test: /\.(s[ac]ss|css)$/, // handle file sass || scss || css
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', // using import 'filename.css' in file tsx, ts
              options: { sourceMap: !isProduction } // show sourcemap in dev env for debugging
            },
            {
              loader: 'sass-loader', // translate sass sang css
              options: { sourceMap: !isProduction }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/, // use for importing image file, if there are any video/image with other format then put in here
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction
                  ? 'static/media/[name].[contenthash:6].[ext]'
                  : '[path][name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/, // import font
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction
                  ? 'static/fonts/[name].[ext]'
                  : '[path][name].[ext]'
              }
            }
          ]
        }
      ]
    },

    output: {
      filename: 'static/js/main.[contenthash:6].js', // using hash file name base on content preventing being cached by CDN or browser.
      path: path.resolve(__dirname, 'dist'), // Build folder dist
      publicPath: '/'
    },
    devServer: {
      hot: true, // enable Hot Module Replacement, hot reload
      port: 3000, // run port 3000 on dev
      historyApiFallback: true, // Must set true if not when using lazyload module React will come across error not loading file.
      // configure file html in public folder
      static: {
        directory: path.resolve(__dirname, 'public', 'index.html'),
        serveIndex: true,
        watch: true // watch content change in index.html for hot reload
      }
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      // Take css off become a distinguished file .css rather than put to file .js
      new MiniCssExtractPlugin({
        filename: isProduction
          ? 'static/css/[name].[contenthash:6].css'
          : '[name].css'
      }),
      // using env in project
      new Dotenv(),
      // Copy all files in folder public except file index.html
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => {
              return !name.endsWith('index.html')
            }
          }
        ]
      }),

      // Plugin help putting tag style và script into index.html
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        filename: 'index.html'
      }),
      //  eslint for webpack
      new ESLintPlugin({
        extensions: ['.tsx', '.ts', '.js', '.jsx']
      })
    ]
  }

  //🚀 when build need some more config
  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      new webpack.ProgressPlugin(), // show % when build
      // compress brotli css và js but no clue why just js is compressed 🥲
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress'
      }),
      new CleanWebpackPlugin() // clean build folder before in prepare for current build
    ]
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
    }
    config.optimization = {
      minimizer: [
        `...`, // Syntax to inherit default minimizers in webpack 5 (i.e. `terser-webpack-plugin`)
        new CssMinimizerPlugin() // minify css
      ]
    }
  }
  return config
}
