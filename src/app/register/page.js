'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiRequest('/register/', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setSuccess(true);
    } catch (err) {
      const msg = err.data?.email?.[0] || err.data?.username?.[0] || err.data?.password?.[0] || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Account created!</h1>
        <p className="text-gray-600">Please wait for admin approval before logging in.</p>
        <button onClick={() => router.push('/login')} className="mt-4 text-blue-600 underline">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="username" placeholder="Username" value={form.username}
          onChange={handleChange} required
          className="border rounded px-3 py-2"
        />
        <input
          name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} required
          className="border rounded px-3 py-2"
        />
        <input
          name="password" type="password" placeholder="Password" value={form.password}
          onChange={handleChange} required minLength={8}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit" disabled={loading}
          className="bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
      </p>
    </div>
  );
}