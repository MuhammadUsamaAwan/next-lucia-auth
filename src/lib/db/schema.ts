import { pgTable, bigint, varchar, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  username: varchar('username', {
    length: 32,
  }).notNull(),
  email: varchar('email', {
    length: 255,
  })
    .notNull()
    .unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  // other user attributes
});

export const userSessions = pgTable('user_sessions', {
  id: varchar('id', {
    length: 128,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => users.id),
  activeExpires: bigint('active_expires', {
    mode: 'number',
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'number',
  }).notNull(),
});

export const userKeys = pgTable('user_keys', {
  id: varchar('id', {
    length: 255,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => users.id),
  hashedPassword: varchar('hashed_password', {
    length: 255,
  }),
});

export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: varchar('id', {
    length: 128,
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 15,
  })
    .notNull()
    .references(() => users.id),
  expires: bigint('expires', {
    mode: 'number',
  }).notNull(),
});
