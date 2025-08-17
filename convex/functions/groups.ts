import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

export const createGroup = mutation({
  args: { name: v.string(), groupId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_externalId', (q) => q.eq('externalId', identity.subject))
      .first();
    if (!user) throw new Error('User not found');

    return await ctx.db.insert('groups', {
      groupId: args.groupId,
      name: args.name,
      ownerId: user._id,
      members: [user._id],
    });
  },
});

export const joinGroup = mutation({
  args: { groupId: v.id('groups'), userId: v.id('users') },
  handler: async (ctx, { groupId, userId }) => {
    const group = await ctx.db.get(groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) {
      await ctx.db.patch(groupId, {
        members: [...group.members, userId],
      });
    }
  },
});

export const listGroups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('groups').collect();
  },
});

export const deleteGroup = mutation({
  args: { groupId: v.id('groups') },
  handler: async (ctx, { groupId }) => {
    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_groupId', (q) => q.eq('groupId', groupId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(groupId);

    return { success: true };
  },
});

export const getGroupByKey = query({
  args: { groupId: v.id('groups') },
  handler: async (ctx, { groupId }) => {
    const group = await ctx.db.get(groupId);

    return group ?? null;
  },
});
