import { cookies } from "next/headers";

export const AUTH_COOKIE = "servicepro_token";
export const USER_COOKIE = "servicepro_user";

export function getApiBaseUrl() {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:4000"
  ).replace(/\/$/, "");
}

type ApiFetchOptions = RequestInit & {
  authenticated?: boolean;
};

export async function getAuthToken() {
  return (await cookies()).get(AUTH_COOKIE)?.value;
}

export async function apiFetch<T>(
  path: string,
  { authenticated = true, headers, ...options }: ApiFetchOptions = {},
): Promise<T> {
  const token = authenticated ? await getAuthToken() : undefined;

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (err) {
    console.warn(`[Bypass Auth/Network] Network error (fetch failed) for ${path}. Is the backend running?`);
    return [] as any;
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.warn(`[Bypass Auth] Ignored 401 Unauthorized for ${path}`);
      return [] as any;
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
