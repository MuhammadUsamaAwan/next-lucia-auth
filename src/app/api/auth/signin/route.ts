import { auth } from '~/lib/auth/lucia';
import { LuciaError } from 'lucia';
import * as context from 'next/headers';

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
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/', // redirect to profile page
      },
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
