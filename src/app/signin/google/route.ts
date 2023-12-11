import { cookies } from 'next/headers';
import { googleAuth } from '~/lib/auth/lucia';

export const GET = async (request: Request) => {
  const [url, state] = await googleAuth.getAuthorizationUrl();
  // store state
  cookies().set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
};
