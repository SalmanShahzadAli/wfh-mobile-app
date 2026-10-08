'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest(`/orders/${id}/`)
      .then(setOrder)
      .catch(() => setError('Order not found.'));
  }, [id]);

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!order) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-1">Order #{order.id}</h1>
      <p className={`inline-block px-2 py-1 rounded text-sm ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
        {order.status === 'paid' ? 'Paid' : order.status}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-1">
            <span>{item.product_name} × {item.quantity}</span>
            <span>${item.price}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-lg font-bold text-right">Total: ${order.total_price}</p>

      <div className="mt-4 text-sm text-gray-600">
        <p>{order.full_name}</p>
        <p>{order.address}, {order.city}, {order.state}, {order.country}</p>
        <p>{order.phone} — {order.email}</p>
      </div>
    </div>
  );
}