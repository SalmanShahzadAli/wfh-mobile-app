'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const loadCart = () => {
    apiRequest('/cart/')
      .then(setCart)
      .catch(() => setError('Failed to load cart.'));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await apiRequest(`/cart/update/${itemId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
      loadCart();
    } catch {
      setError('Could not update quantity.');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await apiRequest(`/cart/remove/${itemId}/`, { method: 'DELETE' });
      loadCart();
    } catch {
      setError('Could not remove item.');
    }
  };

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!cart) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Cart</h1>
        <Link href="/products" className="text-sm text-blue-600 underline">
          &larr; Continue Shopping
        </Link>
      </div>

      {cart.items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {cart.items.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{item.product_name}</span>
                  <span>${item.subtotal}</span>
                </div>
                <p className="text-sm text-gray-500">${item.product_price} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                    className="border rounded w-16 px-2 py-1"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 text-sm underline ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total: ${cart.total_price}</span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="mt-4 w-full bg-green-600 text-white rounded px-3 py-2"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}