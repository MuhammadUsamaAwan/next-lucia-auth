import { redirect } from 'next/navigation';
import { getSession } from '~/lib/auth/lucia';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div>
      <div>Hello {session.user.username}</div>
      <div>Your email is {session.user.emailVerified ? 'verified' : 'not verified'}</div>
      {!session.user.emailVerified && (
        <form action='api/auth/email-verification' method='post'>
          <button>Send Verification Link</button>
        </form>
      )}
      <form action='api/auth/signout' method='post'>
        <button>Signout</button>
      </form>
    </div>
  );
}
