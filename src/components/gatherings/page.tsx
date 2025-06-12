'use client';

import { useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvieder';
import { useRouter } from 'next/navigation';

export default function GatheringsPage() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token]);

  if (!token) return null;

  return <div>모임 목록 페이지입니다.</div>;
}
