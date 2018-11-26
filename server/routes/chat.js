export default (router) => {
  router
    .get('chat', '/chat', async (ctx) => {
      ctx.render('chat/index');
    });
};
