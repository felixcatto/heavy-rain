import { User, Role } from '../models';
import { emptyObject } from '../lib/utils';
import { requireAdmin, requireOwnership } from '../lib/middlewares';
import buildFormObj from '../lib/formObjectBuilder';


export default (router) => {
  const userFields = [
    'firstName',
    'lastName',
    'email',
    'passwordDigest',
  ];
  const userFieldsForAdmin = userFields.concat('RoleId');

  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll({ include: [Role] });
      ctx.render('users/index', { users });
    })

    .get('newUser', '/users/new', requireAdmin, async (ctx) => {
      const roles = await Role.findAll({ raw: true });
      ctx.render('users/new', {
        user: emptyObject,
        roles,
      });
    })

    .get('editUser', '/users/:id/edit', requireOwnership, async (ctx) => {
      const roles = await Role.findAll({ raw: true });
      const user = await User.findOne({
        where: { id: ctx.params.id },
        raw: true,
      });

      ctx.render('users/edit', {
        user: {
          ...user,
          password: '',
        },
        roles,
        type: 'edit',
      });
    })

    .post('users', '/users', requireAdmin, async (ctx) => {
      try {
        await User.create(ctx.request.body, {
          fields: userFieldsForAdmin,
        });
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.render('users/new', {
          user: buildFormObj(ctx.request.body, e),
        });
      }
    })

    .put('user', '/users/:id', requireOwnership, async (ctx) => {
      const { isAdmin } = ctx.state;

      try {
        await User.update(ctx.request.body, {
          where: { id: ctx.params.id },
          fields: isAdmin
            ? userFieldsForAdmin
            : userFields,
        });
        ctx.redirect(router.url('users'));
      } catch (e) {
        ctx.render('users/edit', {
          user: buildFormObj(ctx.request.body, e, ctx.params.id),
          type: 'edit',
        });
      }
    })

    .delete('user', '/users/:id', requireAdmin, async (ctx) => {
      await User.destroy({ where: { id: ctx.params.id } });
      ctx.redirect(router.url('users'));
    });
};
