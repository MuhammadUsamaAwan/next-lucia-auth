import { auth } from '~/lib/auth/lucia';
import { LuciaError } from 'lucia';

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  if (!email || !password) {
    return;
  }

  try {
    const key = await auth.useKey('email', email, password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);
    return new Response(null, {
      headers: {
        Location: '/', // redirect to profile page
        'Set-Cookie': sessionCookie.serialize(), // store session cookie
      },
      status: 302,
    });
  } catch (e) {
    if (e instanceof LuciaError && (e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')) {
      // user does not exist or invalid password
      return Response.json(
        {
          error: 'Incorrect username or password',
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        error: 'An unknown error occurred',
      },
      {
        status: 500,
      }
    );
  }
};
