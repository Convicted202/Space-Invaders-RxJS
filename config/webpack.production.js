const base = require('./webpack.base');
const { loaders, plugins } = require('./webpack.common');

const config = Object.assign(base, {
  module: {
    loaders: [
      loaders.babel,
      loaders.stylus.production
    ]
  },
  plugins: [
    plugins.html.production,
    plugins.css,
    plugins.define.production
  ]
});

module.exports = config;
