import { apiFetch } from "@/lib/api-server";
import type { Service, ServiceStatus } from "@/lib/types";

export const activeServiceStatuses: ServiceStatus[] = ["en_curso"];

export function isActiveService(service: Service) {
  return activeServiceStatuses.includes(service.estado);
}

export async function getServices() {
  return apiFetch<Service[]>("/services");
}

export async function getPendingServices() {
  return apiFetch<Service[]>("/services/pendientes");
}
