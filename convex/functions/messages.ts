import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const sendMessage = mutation({
  args: { groupId: v.id('groups'), text: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.insert('messages', {
      groupId: args.groupId,
      senderId: user._id,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { groupId: v.optional(v.id('groups')) },
  handler: async (ctx, { groupId }) => {
    if (!groupId) return [];

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_groupId', (q) => q.eq('groupId', groupId))
      .order('asc')
      .collect();

    const messagesWithSender = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          sender: sender
            ? {
                id: msg.senderId,
                name: sender.name,
                email: sender.email,
                role: sender.role,
              }
            : null,
        };
      })
    );

    return messagesWithSender;
  },
});
