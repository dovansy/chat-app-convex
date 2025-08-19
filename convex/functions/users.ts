import { mutation } from '../_generated/server';

export const createOrUpdateUser = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_token', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    const newUserId = await ctx.db.insert('users', {
      tokenIdentifier: identity.tokenIdentifier,
      externalId: identity.subject,
      email: identity.email ?? '',
      name: identity.name,
      role: identity.email === 'dovansy.dev@gmail.com' ? 'admin' : 'user',
    });
    return { _id: newUserId, ...identity, role: 'user' };
  } else {
    await ctx.db.patch(user._id, {
      email: identity.email,
      name: identity.name,
      externalId: identity.subject,
    });
    return { ...user, ...identity };
  }
});
