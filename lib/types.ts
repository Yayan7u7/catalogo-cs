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
  jefeId?: string | null;
  jefeSecundarioId?: string | null;
  nombreReal: string;
  nombreArtistico: string;
  slugCatalogo: string;
  fotoPerfilUrl: string | null;
  descripcion: string | null;
  precioBaseHora: string;
  disponible: boolean;
  catalogoActivo: boolean;
  totalServiciosValorados: number;
  promedioCalificacion: number | null;
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
  estadoLiquidacion?: "transporte_pendiente" | "cerrada";
  viajes?: Trip[];
  cliente?: Client;
  empleada?: Employee;
};

export type Trip = {
  id: string;
  servicioId: string;
  choferId: string | null;
  tipo: "ida" | "regreso";
  estado: "notificado" | "aceptado" | "en_camino" | "llegado" | "en_curso" | "finalizado" | "rechazado" | "cancelado";
  proveedorTransporte: "interno" | "uber";
  tarifa: string | number;
  telegramUberFileId?: string | null;
};

export type ConversationMessage = {
  id: string;
  clienteId: string;
  servicioId: string;
  emisor: "ia" | "jefe" | "cliente";
  mensaje: string;
  enviadoAt: string;
};

export type EmployeeReportCategory =
  | "trato_inadecuado"
  | "demora_impuntualidad"
  | "incumplimiento"
  | "cobro"
  | "seguridad"
  | "otro";

export type EmployeeReportOrigin = "cliente" | "chofer";
export type EmployeeReportPriority = "normal" | "alta" | "urgente";
export type EmployeeReportStatus =
  | "nuevo"
  | "en_revision"
  | "resuelto"
  | "descartado";

export type ServiceExtension = {
  id: string;
  servicioId: string;
  numeroProrroga: number;
  minutosSolicitados: number;
  solicitadaAt: string;
  aprobada: boolean;
};

export type EmployeeReportHistory = {
  id: string;
  reportId: string;
  actorUserId: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  note: string | null;
  createdAt: string;
  actor?: ApiUser | null;
};

export type EmployeeReport = {
  id: string;
  serviceId: string;
  employeeId: string;
  bossId: string;
  origin: EmployeeReportOrigin;
  clientId: string | null;
  driverId: string | null;
  category: EmployeeReportCategory;
  description: string;
  priority: EmployeeReportPriority;
  status: EmployeeReportStatus;
  assignedAdminId: string | null;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
  client?: Client | null;
  driver?: Driver | null;
  assignedAdmin?: ApiUser | null;
  service?: Service & { prorrogases?: ServiceExtension[] };
  history?: EmployeeReportHistory[];
};

export type EmployeeReportsPage = {
  items: EmployeeReport[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type EmployeeReportSummary = {
  newCases: number;
  urgentCases: number;
  employeesOverTolerance: number;
};

export type EmployeeTolerance = {
  employeeId: string;
  employeeName: string;
  reports90Days: number;
  reportsHistorical: number;
  extensions30Days: number;
  extensionsHistorical: number;
  reportsOverTolerance: boolean;
  extensionsOverTolerance: boolean;
  reportTolerance: number;
  extensionTolerance: number;
};

export type EmployeeReportFilters = {
  page?: number;
  limit?: number;
  status?: EmployeeReportStatus;
  priority?: EmployeeReportPriority;
  category?: EmployeeReportCategory;
  origin?: EmployeeReportOrigin;
  employeeId?: string;
  bossId?: string;
  from?: string;
  to?: string;
};
