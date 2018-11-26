import applyUserRouting from './user';
import applyArticleRouting from './article';
import applySessionRouting from './session';
import applyChatRouting from './chat';


export default (app, router) => {
  router.get('root', '/', (ctx) => {
    ctx.render('common/index');
  });

  applyUserRouting(router);
  applyArticleRouting(router);
  applySessionRouting(router);
  applyChatRouting(router);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
