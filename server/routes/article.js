import getCommentsRouter from './comment';
import { Article, Comment } from '../models';
import { emptyObject } from '../lib/utils';


export default (router) => {
  const articleFields = [
    'title',
    'text',
  ];

  router
    .get('articles', '/articles', async (ctx) => {
      const articles = await Article.findAll({ raw: true });
      ctx.render('articles/index', { articles });
    })

    .get('newArticle', '/articles/new', (ctx) => {
      ctx.render('articles/new', { article: emptyObject });
    })

    .get('article', '/articles/:id', async (ctx) => {
      const article = await Article.findOne({
        where: { id: ctx.params.id },
        include: [{
          model: Comment,
        }],
      });

      const articleDTO = article.get({ plain: true });
      ctx.render('articles/show', {
        article,
        comments: articleDTO.Comments,
        comment: emptyObject,
      });
    })

    .get('editArticle', '/articles/:id/edit', async (ctx) => {
      const article = await Article.findOne({
        where: { id: ctx.params.id },
        raw: true,
      });
      ctx.render('articles/edit', { article, type: 'edit' });
    })

    .post('articles', '/articles', async (ctx) => {
      await Article.create(ctx.request.body, {
        fields: articleFields,
      });
      ctx.redirect(router.url('articles'));
    })

    .put('article', '/articles/:id', async (ctx) => {
      await Article.update(ctx.request.body, {
        where: { id: ctx.params.id },
        fields: articleFields,
      });
      ctx.redirect(router.url('articles'));
    })

    .delete('article', '/articles/:id', async (ctx) => {
      await Article.destroy({ where: { id: ctx.params.id } });
      ctx.redirect(router.url('articles'));
    });

  const comments = getCommentsRouter(router);
  router.use('/articles/:articleId', comments.routes(), comments.allowedMethods());
};
