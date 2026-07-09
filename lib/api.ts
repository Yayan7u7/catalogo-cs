// ---- Tipos ----

export interface Modelo {
  _id: string;
  nombre: string;
  descripcion: string;
  fotoPrincipal: string;
  fotos: string[];
  linkX: string;
  contactLink: string;
  contactLabel: string;
  disponible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModeloPayload {
  nombre: string;
  descripcion: string;
  fotoPrincipal: string;
  fotos: string[];
  linkX: string;
  contactLink: string;
  contactLabel: string;
  disponible?: boolean;
}

// ---- Helpers de Fetch ----
// Ahora usamos las API Routes internas que se conectan a MongoDB

/**
 * Retorna las modelos de la base de datos.
 * Si onlyAvailable es true, filtra solo las disponibles.
 */
export async function getModelos(onlyAvailable = false): Promise<Modelo[]> {
  try {
    const res = await fetch(`/api/modelos?onlyAvailable=${onlyAvailable}`, {
      method: "GET",
      // Si llamamos a esta API en el servidor (SSR), necesitamos URLs absolutas,
      // pero en este proyecto el fetch se hace desde el cliente (useEffect en pages)
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al cargar modelos");
    
    return await res.json();
  } catch (error) {
    console.error("getModelos Error:", error);
    return [];
  }
}

/**
 * Crea una nueva modelo.
 */
export async function createModelo(payload: ModeloPayload): Promise<Modelo> {
  const res = await fetch("/api/modelos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "No se pudo crear la modelo");
  }

  return await res.json();
}

/**
 * Actualiza una modelo existente.
 */
export async function updateModelo(
  id: string,
  payload: ModeloPayload
): Promise<Modelo> {
  const res = await fetch(`/api/modelos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "No se pudo actualizar la modelo");
  }

  return await res.json();
}

/**
 * Elimina una modelo.
 */
export async function deleteModelo(id: string): Promise<void> {
  const res = await fetch(`/api/modelos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "No se pudo eliminar la modelo");
  }
}
