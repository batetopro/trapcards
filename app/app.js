const init = async (config, data, controllerFactory) => {
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  
  require('./app.config').baseConfig(app, config);
  require('./app.config').authConfig(app, data);

  require('./routers').attachTo(app, controllerFactory);

  require('./app.config').errorConfig(app, controllerFactory);

  app.use(express.static('public'));

  return server;
};

module.exports = { init };
