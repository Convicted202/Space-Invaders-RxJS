const base = require('./webpack.base');
const devServer = require('./webpack.devServer');
const { loaders, plugins } = require('./webpack.common');

const config = Object.assign({}, base, devServer, {
  cache: true,
  debug: true,
  devtool: 'eval-source-map',
  module: {
    loaders: [
      loaders.babel,
      loaders.stylus.develop
    ]
  },
  plugins: [
    plugins.hot,
    plugins.html.develop,
    plugins.define.develop
  ]
});

module.exports = config;
