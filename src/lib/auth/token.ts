// token.ts
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { db } from '~/lib/db';
import { emailVerificationTokens, users } from '../db/schema';
import { eq } from 'drizzle-orm';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
  const storedUserTokens = await db.query.emailVerificationTokens.findMany({
    where: eq(users.id, userId),
  });
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find(token => {
      // check if expiration is within 1 hour
      // and reuse the token if true
      return isWithinExpiration(token.expires - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(63);
  await db.insert(emailVerificationTokens).values({
    id: token,
    userId,
    expires: new Date().getTime() + EXPIRES_IN,
  });
  return token;
};

export const validateEmailVerificationToken = async (token: string) => {
  const storedToken = await db.transaction(async tx => {
    const storedToken = await tx.query.emailVerificationTokens.findFirst({
      where: eq(emailVerificationTokens.id, token),
    });
    if (!storedToken) throw new Error('Invalid token');
    await tx.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, storedToken.userId));
    return storedToken;
  });
  if (!isWithinExpiration(storedToken.expires)) {
    throw new Error('Expired token');
  }
  return storedToken.userId;
};
