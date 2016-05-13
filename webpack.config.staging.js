var createWebpackConfig = require('./webpack.config.helper.js').createWebpackConfig;

module.exports = createWebpackConfig('staging', {
  apis: {
    articles: {
      host: JSON.stringify('https://intrasearch.govwizely.com/v1')
    },
    trade: {
      host: JSON.stringify('https://api.govwizely.com'),
      key: JSON.stringify('0ooVzDG3pxt0azCL9uUBMYLS')
    }
  }
});