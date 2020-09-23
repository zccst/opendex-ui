const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.config.base');
const client = process.env.CLIENT || 'desktop';
const baseSrc = path.resolve(__dirname, `../src/${client}`);
const address = '127.0.0.1';
const port = 5200;
base.output.publicPath = `http://${address}:${port}/`;
base.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new webpack.HotModuleReplacementPlugin({}),
  new HtmlWebpackPlugin({
    template: path.resolve(baseSrc, 'index.html'),
    filename: 'index.html',
  })
];

module.exports = Object.assign(base, {
  mode: 'development',
  devServer: {
    contentBase: baseSrc,
    hot: true,
    host: address,
    port: 5200,
    proxy: {
      '/tradingview/*': {
        target: 'http://okcombeta.bafang.com/',
        changeOrigin: true,
        secure: true,
      },
    },
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '/index.html' }],
    },
  },
  devtool: 'source-map',
});
