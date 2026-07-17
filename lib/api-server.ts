import { getAccessToken } from "@/lib/auth";

export function getApiBaseUrl() {
  return (
    process.env.BACKEND_API_URL ??
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:4000"
  ).replace(/\/$/, "");
}

type ApiFetchOptions = RequestInit & {
  authenticated?: boolean;
};

export async function getAuthToken() {
  return getAccessToken();
}

export async function apiFetch<T>(
  path: string,
  { authenticated = true, headers, ...options }: ApiFetchOptions = {},
): Promise<T> {
  const token = authenticated ? await getAuthToken() : undefined;

  let response: Response;
  try {
    const isFormData = options.body instanceof FormData;
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      cache: "no-store",
      headers: {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    console.warn(`[Bypass Auth/Network] Network error (fetch failed) for ${path}. Is the backend running?`, error);
    return [] as unknown as T;
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.warn(`[Bypass Auth] Ignored 401 Unauthorized for ${path}`);
      return [] as unknown as T;
    }


    let message = `Backend request failed with ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // Keep the generic message when the backend returns no JSON body.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
