"use server";

import { getAccessToken } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

export async function getJefesAction(): Promise<{ id: string; email: string; nombre?: string | null; apellido?: string | null }[]> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/users?rol=jefe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al obtener usuarios");
    const users = await res.json();
    return users.map((u: any) => ({
      id: u.id,
      email: u.email,
      nombre: u.nombre,
      apellido: u.apellido,
    }));
  } catch (error) {
    console.error("getJefesAction error:", error);
    return [];
  }
}

export async function createJefeAction(
  nombre: string,
  apellido: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, apellido, email, password, rol: "jefe" }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al crear el jefe" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("createJefeAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}

export async function updateJefeAction(
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  password?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const body: any = { nombre, apellido, email };
    if (password && password.trim() !== "") {
      body.password = password;
    }

    const res = await fetch(`${BACKEND_API_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al actualizar el jefe" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJefeAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}

export async function deleteJefeAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al eliminar el jefe" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("deleteJefeAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}

export async function generateTelegramOtpAction(id: string): Promise<{ success: boolean; code?: string; expiresAt?: string; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/users/${id}/telegram-otp`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al generar OTP" };
    }

    const data = await res.json();
    return { success: true, code: data.code, expiresAt: data.expiresAt };
  } catch (error: any) {
    console.error("generateTelegramOtpAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}
