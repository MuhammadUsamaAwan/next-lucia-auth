import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <form
      action='api/auth/reset-password'
      method='post'
      className='max-w-xl flex flex-col gap-1 justify-center mx-auto my-10'
    >
      <input placeholder='Email' type='email' name='email' />
      <button type='submit'>Submit</button>
      <Link href='/signin'>Signin</Link>
    </form>
  );
}
