import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { pool } from '~/lib/db';
import * as context from 'next/headers';
import { cache } from 'react';
import { google } from '@lucia-auth/oauth/providers';

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
      emailVerified: user.email_verified,
    };
  },
});

export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  redirectUri: 'http://localhost:3000/api/auth/callback/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid',
  ],
});

export type Auth = typeof auth;

export const getSession = cache(() => {
  const authRequest = auth.handleRequest('GET', context);
  return authRequest.validate();
});
