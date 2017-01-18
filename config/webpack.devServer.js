const config = {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      port: 9090,
      open: true,
      contentBase: './src'
    }
};

module.exports = config;
