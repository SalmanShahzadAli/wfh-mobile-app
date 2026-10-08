'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, clearTokens } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/profile/')
      .then(setProfile)
      .catch(() => setError('Failed to load profile.'));
  }, []);

  const handleLogout = () => {
    clearTokens();
    router.push('/login');
  };

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>

      <div className="border rounded-lg p-4 flex flex-col gap-2">
        <div>
          <span className="text-sm text-gray-500">Username</span>
          <p className="font-semibold">{profile.username}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Email</span>
          <p className="font-semibold">{profile.email}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Account Status</span>
          <p className="font-semibold">{profile.is_approved ? 'Approved' : 'Pending Approval'}</p>
        </div>
      </div>

      <button onClick={handleLogout} className="mt-4 w-full bg-red-600 text-white rounded px-3 py-2">
        Logout
      </button>
    </div>
  );
}