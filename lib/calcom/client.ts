const CALCOM_BASE_URL = process.env.CALCOM_BASE_URL ?? 'https://api.cal.com/v2';
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;

interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | undefined>;
}

export async function calcomRequest(path: string, options: RequestOptions = {}) {
  const query = new URLSearchParams();
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (typeof value !== 'undefined') {
      query.set(key, String(value));
    }
  });

  const url = `${CALCOM_BASE_URL}${path}${query.size ? `?${query.toString()}` : ''}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(CALCOM_API_KEY ? { Authorization: `Bearer ${CALCOM_API_KEY}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error('Falha na API do Cal.com.');
  }

  return response.json();
}
