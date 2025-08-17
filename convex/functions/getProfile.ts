import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getProfile = query(async ({ auth }) => {
  const identity = await auth.getUserIdentity();
  if (!identity) return console.log('Unauthenticated');
  console.log('identity: ', identity);

  return {
    subject: identity.subject,
    tokenIdentifier: identity.tokenIdentifier,
    issuer: identity.issuer,
    email: identity.email,
  };
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    return user || null;
  },
});
