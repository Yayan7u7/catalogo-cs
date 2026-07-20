"use server";

import { getAccessToken } from "@/lib/auth";
import { getStaffTrustScores } from "@/lib/staff-reliability";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

export async function getChoferesAction(): Promise<
  {
    id: string;
    nombre: string;
    telefono: string;
    email: string;
    usuarioId: string;
    vehiculoMarca?: string;
    vehiculoModelo?: string;
    vehiculoColor?: string;
    vehiculoPlaca?: string;
    trustScore?: number | null;
  }[]
> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const [res, trustScores] = await Promise.all([
      fetch(`${BACKEND_API_URL}/drivers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      getStaffTrustScores(BACKEND_API_URL, token),
    ]);

    if (!res.ok) throw new Error("Error al obtener choferes");
    const drivers = await res.json();
    return drivers.map((d: any) => ({
      id: d.id,
      nombre: d.nombre,
      telefono: d.telefono,
      email: d.usuario?.email || "",
      usuarioId: d.usuarioId,
      vehiculoMarca: d.vehiculoMarca || "",
      vehiculoModelo: d.vehiculoModelo || "",
      vehiculoColor: d.vehiculoColor || "",
      vehiculoPlaca: d.vehiculoPlaca || "",
      trustScore: trustScores[d.usuarioId] ?? null,
    }));
  } catch (error) {
    console.error("getChoferesAction error:", error);
    return [];
  }
}

export async function createChoferAction(
  nombre: string,
  telefono: string,
  email: string,
  password: string,
  vehiculoMarca?: string,
  vehiculoModelo?: string,
  vehiculoColor?: string,
  vehiculoPlaca?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        telefono,
        email,
        password,
        vehiculoMarca: vehiculoMarca || null,
        vehiculoModelo: vehiculoModelo || null,
        vehiculoColor: vehiculoColor || null,
        vehiculoPlaca: vehiculoPlaca || null,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al crear el chofer" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("createChoferAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}

export async function updateChoferAction(
  id: string,
  nombre: string,
  telefono: string,
  email: string,
  password?: string,
  vehiculoMarca?: string,
  vehiculoModelo?: string,
  vehiculoColor?: string,
  vehiculoPlaca?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const body: any = {
      nombre,
      telefono,
      email,
      vehiculoMarca: vehiculoMarca || null,
      vehiculoModelo: vehiculoModelo || null,
      vehiculoColor: vehiculoColor || null,
      vehiculoPlaca: vehiculoPlaca || null,
    };
    if (password && password.trim() !== "") {
      body.password = password;
    }

    const res = await fetch(`${BACKEND_API_URL}/drivers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al actualizar el chofer" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateChoferAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}

export async function deleteChoferAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${BACKEND_API_URL}/drivers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message || "Error al eliminar el chofer" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("deleteChoferAction error:", error);
    return { success: false, error: error.message || "Error de conexion con el servidor" };
  }
}
