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
      <form action='api/auth/signout' method='post'>
        <button>Signout</button>
      </form>
    </div>
  );
}
