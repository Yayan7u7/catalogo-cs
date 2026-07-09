"use server";

import { createSessionCookie, clearSessionCookie, getSessionPayload } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

export async function loginAction(email: string, password: string) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Credenciales incorrectas" };
    }

    const data = await res.json(); // { access_token: "..." } o { accessToken: "..." }
    const token = data.access_token || data.accessToken;
    if (!token) {
      return { success: false, error: "No se recibió token de acceso" };
    }

    // Guardamos el accessToken de NestJS en la cookie de sesion de Next.js
    await createSessionCookie(token);

    return { success: true };
  } catch (error: any) {
    console.error("loginAction error:", error);
    return { success: false, error: "Error de conexión con el servidor de autenticación" };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  return { success: true };
}

export async function checkSessionAction() {
  const payload = await getSessionPayload();
  return !!payload;
}
