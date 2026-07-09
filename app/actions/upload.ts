"use server";

import { getAccessToken } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

export async function uploadImageAction(formData: FormData) {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("No autorizado");
    }

    const res = await fetch(`${BACKEND_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // En Next.js Server Actions, podemos retransmitir el FormData directamente
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Error al subir la imagen en el backend");
    }

    const data = await res.json();
    return data.url as string;
  } catch (error: any) {
    console.error("uploadImageAction error:", error);
    throw new Error(error.message || "Error de conexión al subir la imagen");
  }
}

export async function deleteImageAction(url: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("No autorizado");
    }

    const res = await fetch(`${BACKEND_API_URL}/upload/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Error al eliminar la imagen en el backend");
    }

    return await res.json();
  } catch (error: any) {
    console.error("deleteImageAction error:", error);
    throw new Error(error.message || "Error de conexión al eliminar la imagen");
  }
}
