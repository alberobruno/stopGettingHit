const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Adjust if your entry point is TypeScript
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
        // Adjust if your API endpoint differs
        target: 'http://localhost:3000/',
        secure: false,
        changeOrigin: true, // Might be required depending on your setup
      },
      '/assets': {
        // Serve assets directory
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/upload': {
        // Handle upload path
        target: 'http://localhost:3000',
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
