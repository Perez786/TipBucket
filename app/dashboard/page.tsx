'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

// A reusable card component for our menu options
const MenuOptionCard = ({ href, title, description }) => (
  <Link href={href} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="card-body">
      <h2 className="card-title text-primary">{title}</h2>
      <p>{description}</p>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Welcome, {session?.user?.name || 'User'}!</h1>
        <p className="text-lg text-gray-600">How would you like to distribute tips today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MenuOptionCard
          href="/express"
          title="Express Version"
          description="For quick, one-time calculations. Enter all tip and employee data for a single period without saving."
        />
        <MenuOptionCard
          href="/templates"
          title="Template Version"
          description="Save and reuse your employee rosters and distribution rules. Ideal for recurring use with the same team."
        />
      </div>
    </div>
  );
}
