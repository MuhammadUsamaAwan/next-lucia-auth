import { auth } from '~/lib/auth/lucia';
import * as context from 'next/headers';
import { generateEmailVerificationToken } from '~/lib/auth/token';

export const POST = async (request: Request) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  if (session.user.emailVerified) {
    // email already verified
    return new Response(null, {
      status: 422,
    });
  }
  try {
    const token = await generateEmailVerificationToken(session.user.userId);
    // TODO: send email with token
    console.log('api/auth/email-verification/' + token);
    return new Response();
  } catch {
    return new Response('An unknown error occurred', {
      status: 500,
    });
  }
};
