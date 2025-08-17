import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    externalId: v.string(),
    role: v.string(), // "admin" | "member"
  })
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
