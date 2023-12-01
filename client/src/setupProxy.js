const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
 // app.use(createProxyMiddleware('/solr', { target: 'http://ccb2ffm3-zlog-dev01.test-server.ag/:8983' })),
  app.use(createProxyMiddleware('/solr', { target: 'http:/localhost/:8983' })),

      app.use(createProxyMiddleware('/triggers', { target: 'http://localhost:9070' })),
    app.use(createProxyMiddleware('/auth', { target: 'http://localhost:9002' }));
};
