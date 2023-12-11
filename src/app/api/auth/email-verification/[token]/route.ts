import { auth } from '~/lib/auth/lucia';
import * as context from 'next/headers';
import { generateEmailVerificationToken, validateEmailVerificationToken } from '~/lib/auth/token';

export const GET = async (request: Request, { params: { token } }: { params: { token: string } }) => {
  try {
    const userId = await validateEmailVerificationToken(token);
    const user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      email_verified: true,
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/', // profile page
        'Set-Cookie': sessionCookie.serialize(),
      },
    });
  } catch {
    return new Response('Invalid email verification link', {
      status: 400,
    });
  }
};
