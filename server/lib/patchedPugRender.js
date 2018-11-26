import clientPages from './clientPages';


export default async (ctx, next) => {
  const pugRender = ctx.render.bind(ctx);

  ctx.render = (path, locals = {}) => {
    pugRender(path, locals);
    const clientScriptName = path.replace(/\//g, '.');
    const script = clientPages.includes(clientScriptName)
      ? `<script src="/js/${clientScriptName}.js" async></script>`
      : '';
    const body = ctx.body.replace('{{clientPageScript}}', script);
    ctx.body = body;
  };

  await next();
};
