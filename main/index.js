import http from 'http';
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import Pug from 'koa-pug';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';
import cn from 'classnames';
import WebSocket from 'ws';
import container from '../lib/container';
import applyRouting from '../routes';
import patchedPugRender from '../lib/patchedPugRender';
import makeChat from '../lib/chat';
import { keys } from '../lib/secure';
import {
  guestUser, isAdmin, isUser, isGuest,
} from '../lib/utils';


const app = new Koa();
const router = new Router();

app.keys = keys;

app.use(logger());
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyParser());
app.use(methodOverride('_method'));

const pug = new Pug({
  viewPath: path.join(__dirname, '../views'),
  noCache: process.env.NODE_ENV !== 'production',
  debug: true,
  pretty: true,
  compileDebug: true,
  locals: [],
  basedir: path.join(__dirname, '../views'),
  helperPath: [
    {
      urlFor: (...args) => router.url(...args),
      cn,
    },
  ],
});
pug.use(app);

app.use(async (ctx, next) => {
  const { db } = container;
  const userId = ctx.cookies.get('userId', { signed: true });

  let user = await db.User.findOne({
    where: { id: userId },
    include: [{ model: db.Role }],
  });

  if (!user) {
    user = guestUser;
  } else {
    user = user.get({ plain: true });
  }

  ctx.state = {
    isSignedIn: !isGuest(user),
    currentUrl: ctx.url,
    userId,
    user,
    db,
    isAdmin,
    isUser,
    isGuest,
  };

  await next();
});

app.use(patchedPugRender);

applyRouting(app, router);

const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });
makeChat(wss);

export default server;
