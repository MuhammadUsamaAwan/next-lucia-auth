export default function SignupPage() {
  return (
    <form action='api/auth/signup' method='post' className='max-w-xl flex flex-col gap-1 justify-center mx-auto my-10'>
      <input placeholder='Email' type='email' name='email' />
      <input placeholder='Username' type='text' name='username' />
      <input placeholder='Password' type='password' name='password' />
      <button type='submit'>Signup</button>
    </form>
  );
}
