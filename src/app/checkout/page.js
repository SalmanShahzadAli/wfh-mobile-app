'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { apiRequest } from '@/lib/api';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: '', phone: '', email: '', address: '', city: '', state: '', country: '',
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cartTotal, setCartTotal] = useState(null);

  useEffect(() => {
    apiRequest('/cart/')
      .then((data) => {
        if (data.items.length === 0) {
          router.push('/cart');
        } else {
          setCartTotal(data.total_price);
        }
      })
      .catch(() => setError('Failed to load cart.'));
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const intentData = await apiRequest('/checkout/create-intent/', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      const result = await stripe.confirmCardPayment(intentData.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: form.full_name,
            email: form.email,
            phone: form.phone,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      await apiRequest(`/checkout/confirm/${intentData.order_id}/`, { method: 'POST' });

      router.push(`/orders/${intentData.order_id}`);
    } catch (err) {
      setError(err.data?.error || 'Checkout failed. Please try again.');
      setProcessing(false);
    }
  };

  if (cartTotal === null) return <p className="text-center mt-10">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 flex flex-col gap-3">
      <h1 className="text-xl font-bold mb-2">Checkout</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required className="border rounded px-3 py-2" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="border rounded px-3 py-2" />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border rounded px-3 py-2" />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="border rounded px-3 py-2" />
      <div className="grid grid-cols-3 gap-2">
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border rounded px-2 py-2" />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required className="border rounded px-2 py-2" />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required className="border rounded px-2 py-2" />
      </div>

      <div className="border rounded px-3 py-3">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-green-600 text-white rounded px-3 py-2 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${cartTotal}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}