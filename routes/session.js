import { encrypt } from '../lib/secure';
import { User } from '../models';
import { emptyObject } from '../lib/utils';


export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      ctx.render('sessions/new', {
        user: emptyObject,
      });
    })

    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user?.passwordDigest === encrypt(password)) {
        ctx.cookies.set('userId', user.id, { signed: true });
        ctx.redirect(router.url('root'));
        return;
      }

      ctx.render('sessions/new', {
        user: {
          email,
          password: '',
          errors: {
            email: 'email or password were wrong',
          },
        },
      });
    })

    .delete('session', '/session', (ctx) => {
      ctx.cookies.set('userId', null, { signed: true });
      ctx.redirect(router.url('root'));
    });
};
