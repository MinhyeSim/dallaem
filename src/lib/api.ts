const BASE_URL = process.env.NEXT_PUBLIC_API_URI;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URI가 .env에 정의되어 있지 않습니다.');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API 요청 실패');
  }

  return res.json();
}
