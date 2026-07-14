"use server";

import { apiFetch } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(data: any) {
  try {
    // Basic data manipulation to fit CreateEmployeeDto
    const formattedData = {
      email: data.email,
      password: data.password,
      telegramChatId: data.telegramChatId || undefined,
      nombreReal: data.nombreReal,
      nombreArtistico: data.nombreArtistico,
      slugCatalogo: data.slugCatalogo,
      fotoPerfilUrl: data.fotoPerfilUrl || undefined,
      descripcion: data.descripcion || undefined,
      precioBaseHora: Number(data.precioBaseHora),
      disponible: data.disponible === true,
      catalogoActivo: data.catalogoActivo === true,
      ubicacionLat: data.ubicacionLat || undefined,
      ubicacionLng: data.ubicacionLng || undefined,
    };

    const res = await apiFetch<any>("/employees", {
      method: "POST",
      body: JSON.stringify(formattedData),
    });

    revalidatePath("/employees");
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al crear la empleada" };
  }
}

export async function createDriverAction(data: any) {
  try {
    // Basic data manipulation to fit CreateDriverDto
    const formattedData = {
      email: data.email,
      password: data.password,
      telegramChatId: data.telegramChatId || undefined,
      nombre: data.nombre,
      telefono: data.telefono,
      disponible: data.disponible === true,
      ubicacionLat: data.ubicacionLat || undefined,
      ubicacionLng: data.ubicacionLng || undefined,
    };

    const res = await apiFetch<any>("/drivers", {
      method: "POST",
      body: JSON.stringify(formattedData),
    });

    revalidatePath("/drivers");
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al crear el chofer" };
  }
}
