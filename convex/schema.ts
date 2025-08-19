import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
    externalId: v.string(),
    role: v.union(v.literal('admin'), v.literal('user')),
  })
    .index('by_token', ['tokenIdentifier'])
    .index('by_email', ['email'])
    .index('by_externalId', ['externalId']),

  groups: defineTable({
    groupId: v.string(),
    name: v.string(),
    ownerId: v.id('users'),
    members: v.array(v.id('users')),
  }).index('by_groupId', ['groupId']),

  messages: defineTable({
    groupId: v.id('groups'),
    senderId: v.id('users'),
    text: v.string(),
    createdAt: v.number(),
  }).index('by_groupId', ['groupId']),
});
