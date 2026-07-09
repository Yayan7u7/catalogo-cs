export interface Modelo {
  _id: string;
  nombre: string; // Mapea a nombreArtistico por compatibilidad con vistas publicas
  nombreReal: string;
  nombreArtistico: string;
  descripcion: string;
  fotoPrincipal: string;
  fotos: string[];
  linkX: string;
  contactLink: string;
  contactLabel: string;
  disponible: boolean;
  precioBaseHora: number;
  tipo: "independiente" | "agencia";
  jefeId?: string | null;
  apartmentId?: string | null;
  usuarioId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModeloPayload {
  nombreReal: string;
  nombreArtistico: string;
  descripcion: string;
  fotoPrincipal: string;
  fotos: string[];
  linkX: string;
  contactLink: string;
  contactLabel: string;
  disponible?: boolean;
  precioBaseHora: number;
  tipo: "independiente" | "agencia";
  jefeId?: string | null;
  apartmentId?: string | null;
}
