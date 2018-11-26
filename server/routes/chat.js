export default (router) => {
  router
    .get('chat', '/chat', async (ctx) => {
      const { URL: { hostname, port } } = ctx.request;
      ctx.render('chat/index', { hostname, port });
    });
};
