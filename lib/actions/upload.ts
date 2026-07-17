"use server";

import { apiFetch } from "@/lib/api-server";

export async function uploadImageAction(formData: FormData) {
  try {
    const data = await apiFetch<any>("/upload", {
      method: "POST",
      body: formData,
      authenticated: true,
    });
    return data.url as string;
  } catch (error: any) {
    console.error("uploadImageAction error:", error);
    throw new Error(error.message || "Error de conexión al subir la imagen");
  }
}

export async function deleteImageAction(url: string) {
  try {
    return await apiFetch<any>("/upload/delete", {
      method: "POST",
      body: JSON.stringify({ url }),
      authenticated: true,
    });
  } catch (error: any) {
    console.error("deleteImageAction error:", error);
    throw new Error(error.message || "Error de conexión al eliminar la imagen");
  }
}
