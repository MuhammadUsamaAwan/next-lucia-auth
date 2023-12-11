export default function ChangePasswordPage({ params: { token } }: { params: { token: string } }) {
  return (
    <form
      action={`/api/auth/reset-password/${token}`}
      method='post'
      className='max-w-xl flex flex-col gap-1 justify-center mx-auto my-10'
    >
      <input placeholder='New Password' type='password' name='password' />
      <button type='submit'>Submit</button>
    </form>
  );
}
