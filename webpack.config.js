const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index_bundle.js',
  },
  devtool: 'eval-source-map',
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true, // Enable HMR on the devServer
    historyApiFallback: true, // Fallback to root for other urls

    static: {
      directory: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },

    headers: { 'Access-Control-Allow-Origin': '*' },

    proxy: {
      '/api': {
        // proxies any request starting with /api
        target: 'http://localhost:3000/',
        secure: false,
        changeOrigin: true,
      },
      '/assets': {
        // proxies any request starting with /assets
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/upload': {
        // proxies any request starting with /upload
        target: 'http://localhost:3000',
        secure: false,
      },
      '**': {
        // proxies any other requests
        target: 'http://localhost:3000/',
        secure: false,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};
