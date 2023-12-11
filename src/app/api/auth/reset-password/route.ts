import { generatePasswordResetToken } from '~/lib/auth/token';
import { db } from '~/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '~/lib/db/schema';

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const email = formData.get('email') as string | null;

  if (!email) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const storedUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!storedUser) {
      return new Response('User does not exist', {
        status: 400,
      });
    }
    const token = await generatePasswordResetToken(storedUser.id);
    console.log(token);
    return new Response();
  } catch (e) {
    return new Response('An unknown error occurred', {
      status: 500,
    });
  }
};
