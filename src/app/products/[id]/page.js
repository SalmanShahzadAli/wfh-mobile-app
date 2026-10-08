'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest(`/products/${id}/`)
      .then(setProduct)
      .catch(() => setError('Product not found.'));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    setMessage('');
    try {
      await apiRequest('/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id }),
      });
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.data?.error || 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <button onClick={() => router.back()} className="text-blue-600 mb-4">&larr; Back</button>

      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
      )}
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p className="text-gray-600 text-lg">${product.price}</p>
      <p className="mt-2">{product.description}</p>
      <p className="text-sm text-gray-500 mt-1">
        {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
      </p>

      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

      <button
        onClick={handleAddToCart}
        disabled={adding || product.stock === 0}
        className="mt-4 w-full bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}