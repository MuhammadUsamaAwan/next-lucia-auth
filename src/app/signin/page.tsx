import Link from 'next/link';

export default function SigninPage() {
  return (
    <form action='api/auth/signin' method='post' className='max-w-xl flex flex-col gap-1 justify-center mx-auto my-10'>
      <input placeholder='Email' type='email' name='email' />
      <input placeholder='Password' type='password' name='password' />
      <button type='submit'>Signin</button>
      <Link href='/signup'>Signup</Link>
      <Link href='/reset-password'>Forgot password</Link>
    </form>
  );
}
