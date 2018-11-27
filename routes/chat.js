export default (router) => {
  router
    .get('chat', '/chat', async (ctx) => {
      const { URL: { hostname, port } } = ctx.request;
      const { NODE_ENV } = process.env;
      ctx.render('chat/index', {
        wsUrl: NODE_ENV === 'production'
          ? ''
          : `ws://${hostname}:${port}`,
      });
    });
};
