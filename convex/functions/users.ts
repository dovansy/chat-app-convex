import { mutation } from '../_generated/server';
import { v } from 'convex/values';

const ADMIN_EMAIL = 'oconaill.darragh.mma@gmail.com';

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existingUser) {
      return existingUser;
    }

    const userId = await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      externalId: args.externalId,
      role: args.email === ADMIN_EMAIL ? 'admin' : 'member',
    });

    return await ctx.db.get(userId);
  },
});

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const email = identity.email;
    const externalId = identity.subject;
    const name = identity.name || '';

    if (!email) throw new Error('No email in identity');

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existingUser) {
      return existingUser;
    }

    const userId = await ctx.db.insert('users', {
      name,
      email,
      externalId,
      role: email === ADMIN_EMAIL ? 'admin' : 'member',
    });

    return await ctx.db.get(userId);
  },
});
