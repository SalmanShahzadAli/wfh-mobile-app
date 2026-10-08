'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/products');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <p className="text-center mt-10">Loading...</p>;
}