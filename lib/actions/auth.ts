"use server";

import { createSessionCookie, clearSessionCookie, getSessionPayload } from "@/lib/auth";
import { apiFetch } from "@/lib/api-server";

export async function loginAction(email: string, password: string) {
  try {
    const data = await apiFetch<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      authenticated: false,
    });

    const token = data.access_token || data.accessToken;
    if (!token) {
      return { success: false, error: "No se recibió token de acceso" };
    }

    // Guardamos el accessToken de NestJS en la cookie de sesion de Next.js
    await createSessionCookie(token);

    return { success: true };
  } catch (error: any) {
    console.error("loginAction error:", error);
    return { success: false, error: error.message || "Error de conexión con el servidor de autenticación" };
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
