import { auth } from '~/lib/auth/lucia';
import { validatePasswordResetToken } from '~/lib/auth/token';

export const POST = async (request: Request, { params: { token } }: { params: { token: string } }) => {
  const formData = await request.formData();
  const password = formData.get('password') as string | null;

  if (!password) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const userId = await validatePasswordResetToken(token);
    let user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateKeyPassword('email', user.email, password);

    if (!user.emailVerified) {
      user = await auth.updateUserAttributes(user.userId, {
        email_verified: true,
      });
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
        'Set-Cookie': sessionCookie.serialize(),
      },
    });
  } catch (e) {
    return new Response('Invalid or expired password reset link', {
      status: 400,
    });
  }
};
