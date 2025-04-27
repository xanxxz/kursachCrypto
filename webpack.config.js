const path = require('path'); // подключаем path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 

module.exports = {
  entry: {
    main: './src/scripts/index.js',
    create: './src/scripts/create.js',
    market: './src/scripts/market.js',
    not: './src/scripts/not.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: ''
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true,
    port: 8080,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]',
        }
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]',
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        'postcss-loader']
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['main'],
      template: './src/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['create'],
      template: 'src/create.html',
      filename: 'create.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['market'],
      template: 'src/market.html',
      filename: 'market.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['not'],
      template: 'src/not.html',
      filename: 'not.html'
    }),
      new MiniCssExtractPlugin()
  ]
}
