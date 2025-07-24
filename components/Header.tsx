'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo: Links to dashboard if logged in, otherwise home */}
        <Link href={session ? "/dashboard" : "/"}>
          <Image
            src="/assets/logo.png"
            alt="Tip Distribution App Logo"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* Right-side navigation */}
        <div className="flex items-center gap-4">

          {/* This entire block will ONLY render if a session exists */}
          {session && (
            <>
              <Link href="/templates" className="text-gray-600 hover:text-primary transition-colors font-medium">
                My Templates
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-outline btn-primary btn-sm"
              >
                Sign Out
              </button>
            </>
          )}

          {/* A placeholder for when the user is not logged in. It's empty, so nothing shows. */}
          {!session && !isLoading && (
             <div style={{ minWidth: '150px' }}> {/* This div can help prevent layout shift */}
                {/* Intentionally empty */}
             </div>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Header;