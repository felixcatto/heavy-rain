import Router from 'koa-router';
import { Article, Comment } from '../models';


export default (articlesRouter) => {
  const router = new Router();
  const commentsFields = [
    'author',
    'text',
  ];

  return router
    .get('editComment', '/comments/:id/edit', async (ctx) => {
      const { articleId } = ctx.params;
      const article = await Article.findOne({
        where: { id: articleId },
        raw: true,
      });

      const comment = await Comment.findOne({
        where: { id: ctx.params.id },
        raw: true,
      });
      ctx.render('comments/edit', {
        article,
        comment,
        type: 'edit',
      });
    })

    .post('comments', '/comments', async (ctx) => {
      const { articleId } = ctx.params;
      const comment = await Comment.create(ctx.request.body, {
        fields: commentsFields,
      });

      const article = await Article.findOne({
        where: { id: articleId },
      });

      await article.addComment(comment);

      ctx.redirect(articlesRouter.url('article', articleId));
    })

    .put('comment', '/comments/:id', async (ctx) => {
      const { articleId } = ctx.params;
      await Comment.update(ctx.request.body, {
        where: { id: ctx.params.id },
        fields: commentsFields,
      });
      ctx.redirect(articlesRouter.url('article', articleId));
    })

    .delete('comment', '/comments/:id', async (ctx) => {
      const { articleId } = ctx.params;
      await Comment.destroy({ where: { id: ctx.params.id } });
      ctx.redirect(articlesRouter.url('article', articleId));
    });
};
