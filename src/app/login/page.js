'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, saveTokens } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/login/', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      saveTokens(data.access, data.refresh);
      router.push('/products');
    } catch (err) {
      setError(err.data?.detail || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} required
          className="border rounded px-3 py-2"
        />
        <input
          name="password" type="password" placeholder="Password" value={form.password}
          onChange={handleChange} required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit" disabled={loading}
          className="bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account? <a href="/register" className="text-blue-600 underline">Register</a>
      </p>
    </div>
  );
}