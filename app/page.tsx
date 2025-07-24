'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('email', { email, redirect: false, callbackUrl: '/dashboard' });
    alert('Please check your email for a magic link to sign in.');
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-text mb-6">Sign in to access your account.</p>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition duration-300 mb-4"
        >
          Sign in with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleEmailSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Sign in with a Magic Link
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-highlight"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-transparent border border-primary text-primary font-bold py-2 px-4 rounded hover:bg-primary hover:text-white transition duration-300"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  );
}
