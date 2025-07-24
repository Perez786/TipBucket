'use client';

import { signIn } from 'next-auth/react';

export default function SignInButtons() {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in with Google
      </button>
      <p className="text-gray-500">Or</p>
      {/* Basic email sign-in form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.currentTarget.email.value;
          signIn('email', { email, callbackUrl: '/dashboard' });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          className="px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Email
        </button>
      </form>
    </div>
  );
}
