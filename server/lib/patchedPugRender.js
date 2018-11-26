import clientPages from './clientPages';


export default async (ctx, next) => {
  const pugRender = ctx.render.bind(ctx);

  ctx.render = (path, locals = {}) => {
    pugRender(path, locals);
    const script = clientPages.includes(path)
      ? `<script src="/js/${path}.js" defer></script>`
      : '';
    const body = ctx.body.replace('{{clientPageScript}}', script);
    ctx.body = body;
  };

  await next();
};
