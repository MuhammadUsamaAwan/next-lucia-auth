import { auth } from '~/lib/auth/lucia';

export default async function HomePage() {
  const user = await auth.getUser('1');
  user.userId;
  return <div>HomePage</div>;
}
