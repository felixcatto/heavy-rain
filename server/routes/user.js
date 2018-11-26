import { User } from '../models';
import { emptyObject } from '../lib/utils';
import buildFormObj from '../lib/formObjectBuilder';


export default (router) => {
  const userFields = [
    'firstName',
    'lastName',
    'email',
    'passwordDigest',
  ];

  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll({ raw: true });
      ctx.render('users/index', { users });
    })

    .get('newUser', '/users/new', (ctx) => {
      ctx.render('users/new', { user: emptyObject });
    })

    .get('editUser', '/users/:id/edit', async (ctx) => {
      const user = await User.findOne({
        where: { id: ctx.params.id },
        raw: true,
      });

      ctx.render('users/edit', {
        user: {
          ...user,
          password: '',
        },
        type: 'edit',
      });
    })

    .post('users', '/users', async (ctx) => {
      try {
        await User.create(ctx.request.body, {
          fields: userFields,
        });
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.render('users/new', {
          user: buildFormObj(ctx.request.body, e),
        });
      }
    })

    .put('user', '/users/:id', async (ctx) => {
      try {
        await User.update(ctx.request.body, {
          where: { id: ctx.params.id },
          fields: userFields,
        });
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.render('users/edit', {
          user: buildFormObj(ctx.request.body, e, ctx.params.id),
          type: 'edit',
        });
      }
    })

    .delete('user', '/users/:id', async (ctx) => {
      await User.destroy({ where: { id: ctx.params.id } });
      ctx.redirect(router.url('users'));
    });
};
