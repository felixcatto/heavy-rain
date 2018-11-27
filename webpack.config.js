const path = require('path');
const merge = require('webpack-merge');
const clientPages = require('./lib/clientPages');


const entries = clientPages.reduce((acc, page) => ({
  ...acc,
  [page]: path.resolve(__dirname, `views/${page}.client.js`),
}), {});

const common = {
  entry: entries,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist/public'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      Client: path.resolve(__dirname, 'clientComponents'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'initial',
          test: /node_modules/,
        },
      },
    },
  },
  stats: {
    warnings: false,
    children: false,
    modules: false,
  },
};


if (process.env.NODE_ENV === 'production') {
  module.exports = merge(common, {
    mode: 'production',
  });
} else {
  module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
  });
}
