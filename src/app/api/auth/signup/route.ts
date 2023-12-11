import { auth } from '~/lib/auth/lucia';
import { LuciaError } from 'lucia';
import * as context from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const email = formData.get('email') as string | null;
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  if (!email || !password || !username) {
    return;
  }

  try {
    const user = await auth.createUser({
      key: {
        providerId: 'email', // auth method
        providerUserId: email, // unique id when using "email" auth method
        password, // hashed by Lucia
      },
      attributes: {
        email,
        username,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
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
    console.log(e);
    if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
      return Response.json(
        {
          error: 'Email already taken',
        },
        {
          status: 409,
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
