import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { pool } from '~/lib/db';

export const auth = lucia({
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  adapter: pg(pool, {
    user: 'users',
    session: 'user_sessions',
    key: 'user_keys',
  }),
  getUserAttributes(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  },
});

export type Auth = typeof auth;
