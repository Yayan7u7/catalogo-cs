"use server";

import { getAccessToken } from "@/lib/auth";
import type { Modelo, ModeloPayload } from "@/types";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

// Mapeador de Empleadas (backend) a Modelo (frontend)
function mapToModelo(emp: any): Modelo {
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "ChambaPastelesBot";
  return {
    _id: emp.id,
    nombre: emp.nombreArtistico, // Mapeado por compatibilidad
    nombreReal: emp.nombreReal || "",
    nombreArtistico: emp.nombreArtistico || "",
    descripcion: emp.descripcion || "",
    fotoPrincipal: emp.fotoPerfilUrl || "",
    fotos: emp.empleadaFotos ? emp.empleadaFotos.map((f: any) => f.url) : [],
    linkX: emp.linkX || "",
    contactLink: `https://t.me/${botUsername}?start=contratar_${emp.id}`,
    contactLabel: emp.contactLabel || "Contacto",
    disponible: emp.disponible,
    precioBaseHora: emp.precioBaseHora ? parseFloat(emp.precioBaseHora) : 100,
    tipo: emp.tipo || "independiente",
    jefeId: emp.jefeId || null,
    apartmentId: emp.apartmentId || null,
    usuarioId: emp.usuarioId || null,
    createdAt: emp.createdAt,
    extras: emp.extrasCatalogos
      ? emp.extrasCatalogos
          .filter((ext: any) => ext.activo !== false)
          .map((ext: any) => ({
            id: ext.id,
            nombre: ext.nombre,
            precio: ext.precio ? parseFloat(ext.precio) : 0,
          }))
      : [],
  };
}

export async function getModelosAction(onlyAvailable = false): Promise<Modelo[]> {
  try {
    const token = await getAccessToken();
    let url = `${BACKEND_API_URL}/catalog/employees`;
    let headers: Record<string, string> = {};

    // Si está autenticado, podemos llamar a la lista completa de administración
    if (token) {
      url = `${BACKEND_API_URL}/employees`;
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
      next: { revalidate: 0 }, // Evitar caché para ver actualizaciones inmediatas
    });

    if (!res.ok) {
      throw new Error("No se pudo obtener las empleadas del backend");
    }

    const data = await res.json();
    let list = data.map(mapToModelo);

    if (onlyAvailable) {
      list = list.filter((m: Modelo) => m.disponible);
    }

    // Aleatorizar el catálogo para el frontend
    return list.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error("getModelosAction error:", error);
    return [];
  }
}

export async function createModeloAction(payload: ModeloPayload): Promise<Modelo> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("No autorizado");
  }

  const cleanName = payload.nombreArtistico.toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = `${payload.nombreArtistico.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;

  const createDto = {
    email: `${cleanName}-${Date.now().toString().slice(-6)}@chambapasteles.com`,
    password: "Password12345!",
    nombreReal: payload.nombreReal,
    nombreArtistico: payload.nombreArtistico,
    slugCatalogo: slug,
    fotoPerfilUrl: payload.fotoPrincipal,
    descripcion: payload.descripcion,
    precioBaseHora: payload.precioBaseHora,
    disponible: payload.disponible ?? true,
    catalogoActivo: true,
    tipo: payload.tipo,
    jefeId: payload.jefeId || null,
    apartmentId: payload.apartmentId || null,
    linkX: payload.linkX || null,
    contactLabel: payload.contactLabel || null,
    fotosExtra: payload.fotos,
    extras: payload.extras || [],
  };

  const res = await fetch(`${BACKEND_API_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(createDto),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al crear la modelo en el backend");
  }

  const data = await res.json();
  return mapToModelo(data);
}

export async function updateModeloAction(id: string, payload: ModeloPayload): Promise<Modelo> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("No autorizado");
  }

  const updateDto = {
    nombreReal: payload.nombreReal,
    nombreArtistico: payload.nombreArtistico,
    fotoPerfilUrl: payload.fotoPrincipal,
    descripcion: payload.descripcion,
    precioBaseHora: payload.precioBaseHora,
    disponible: payload.disponible,
    tipo: payload.tipo,
    jefeId: payload.jefeId || null,
    apartmentId: payload.apartmentId || null,
    linkX: payload.linkX || null,
    contactLabel: payload.contactLabel || null,
    fotosExtra: payload.fotos,
    extras: payload.extras || [],
  };

  const res = await fetch(`${BACKEND_API_URL}/employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateDto),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al actualizar la modelo en el backend");
  }

  const data = await res.json();
  return mapToModelo(data);
}

export async function deleteModeloAction(id: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("No autorizado");
  }

  const res = await fetch(`${BACKEND_API_URL}/employees/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al eliminar la modelo en el backend");
  }
}

export async function getJefesAction(): Promise<{ id: string; email: string }[]> {
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
    return users.map((u: any) => ({ id: u.id, email: u.email }));
  } catch (error) {
    console.error("getJefesAction error:", error);
    return [];
  }
}

export async function getApartmentsAction(): Promise<{ id: string; name: string }[]> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/apartments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al obtener apartamentos");
    const apartments = await res.json();
    return apartments.map((a: any) => ({
      id: a.id,
      name: a.nombre || `Apto ${a.nombre || a.id}`,
    }));
  } catch (error) {
    console.error("getApartmentsAction error:", error);
    return [];
  }
}
