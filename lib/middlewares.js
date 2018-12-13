export const requireAdmin = async (ctx, next) => {
  const { isAdmin } = ctx.state;
  if (!isAdmin) {
    ctx.throw(403);
  }
  await next();
};

export const requireAuth = async (ctx, next) => {
  const { isGuest } = ctx.state;
  if (isGuest) {
    ctx.throw(403);
  }
  await next();
};

export const requireOwnership = async (ctx, next) => {
  const { isAdmin, currentUser } = ctx.state;
  if (Number(ctx.params.id) !== currentUser.id && !isAdmin) {
    ctx.throw(403);
  }
  await next();
};
