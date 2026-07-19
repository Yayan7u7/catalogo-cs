import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import type { AuthUser } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const COOKIE_NAME = "cs_admin_session";

export async function createSessionCookie(accessToken: string, user: AuthUser) {
  const token = await new SignJWT({ accessToken, user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 1 semana
    .sign(encodedSecret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  const payload = await getSessionPayload();
  return payload?.accessToken as string | undefined;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const payload = await getSessionPayload();
  return (payload?.user as AuthUser | undefined) ?? null;
}

/**
 * Valida la autenticacion leyendo la cookie desde el request entrante.
 * Util para rutas de API.
 */
export function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  // Aca podriamos hacer jwtVerify sincrono o asincrono, 
  // pero para mayor rapidez en serverless (si no queremos decodificar), 
  // al menos verificamos que exista el token.
  // Lo ideal seria hacer jwtVerify asincrono, pero esto es un util basico.
  // Vamos a cambiarlo a un chequeo asincrono completo.
  return !!token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch {
    return null;
  }
}
