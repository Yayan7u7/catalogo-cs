export type AuthUser = {
  id: string;
  email: string;
  rol: "jefe" | "empleada" | "chofer" | "admin";
};

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

export type ApiUser = AuthUser & {
  activo?: boolean;
  telegramChatId?: string | null;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export type EmployeePhoto = {
  id: string;
  empleadaId: string;
  url: string;
  orden: number;
  createdAt?: string;
};

export type Employee = {
  id: string;
  usuarioId: string;
  nombreReal: string;
  nombreArtistico: string;
  slugCatalogo: string;
  fotoPerfilUrl: string | null;
  descripcion: string | null;
  precioBaseHora: string;
  disponible: boolean;
  catalogoActivo: boolean;
  ubicacionLat: string | null;
  ubicacionLng: string | null;
  ultimaUbicacionAt?: string | null;
  createdAt?: string;
  empleadaFotos?: EmployeePhoto[];
  usuario?: ApiUser;
};

export type Driver = {
  id: string;
  usuarioId: string;
  nombre: string;
  telefono: string;
  disponible: boolean;
  ubicacionLat: string | null;
  ubicacionLng: string | null;
  ultimaUbicacionAt?: string | null;
  createdAt?: string;
  usuario?: ApiUser;
};

export type Client = {
  id: string;
  telegramChatId: string;
  nombreTelegram: string | null;
  createdAt?: string;
  primerContactoAt?: string;
};

export type ServiceStatus =
  | "pendiente"
  | "en_curso"
  | "finalizado"
  | "cancelado"
  | "pendiente_encadenado";

export type Service = {
  id: string;
  empleadaId: string;
  clienteId: string;
  jefeId: string;
  metodoPago: "efectivo" | "tarjeta" | "transferencia";
  duracionPactadaHoras: string;
  duracionFinalHoras: string | null;
  ubicacionClienteLat: string;
  ubicacionClienteLng: string;
  precioBaseHoraPactado: string;
  totalBase: string;
  totalExtras: string;
  totalFinal: string;
  horaInicioServicio: string | null;
  horaFinServicio: string | null;
  horaLlegadaCasa: string | null;
  prorrogasUsadas: number;
  estado: ServiceStatus;
  notas: string | null;
  iaActiva: boolean;
  calificacion: number | null;
  comentariosCalificacion: string | null;
  servicioPrevioId: string | null;
  horaInicioEstimada: string | null;
  createdAt: string;
  updatedAt: string;
  cliente?: Client;
  empleada?: Employee;
};
