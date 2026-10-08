'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest, getAccessToken, clearTokens } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAccessToken()) {
      router.push('/login');
      return;
    }

    apiRequest('/products/')
      .then((data) => setProducts(data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex gap-3 items-center text-sm">
          <Link href="/cart" className="text-blue-600 underline">Cart</Link>
          <Link href="/orders" className="text-blue-600 underline">Orders</Link>
          <Link href="/profile" className="text-blue-600 underline">Profile</Link>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-3 flex gap-3 items-center"
          >
            {product.image && (
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
            )}
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}