import type { Modelo, ModeloPayload } from "@/types";
export type { Modelo, ModeloPayload };


import {
  getModelosAction,
  createModeloAction,
  updateModeloAction,
  deleteModeloAction,
} from "@/app/actions/modelos";

/**
 * Retorna las modelos de la base de datos.
 * Si onlyAvailable es true, filtra solo las disponibles.
 */
export async function getModelos(onlyAvailable = false): Promise<Modelo[]> {
  return getModelosAction(onlyAvailable);
}

/**
 * Crea una nueva modelo.
 */
export async function createModelo(payload: ModeloPayload): Promise<Modelo> {
  return createModeloAction(payload);
}

/**
 * Actualiza una modelo existente.
 */
export async function updateModelo(
  id: string,
  payload: ModeloPayload
): Promise<Modelo> {
  return updateModeloAction(id, payload);
}

/**
 * Elimina una modelo.
 */
export async function deleteModelo(id: string): Promise<void> {
  return deleteModeloAction(id);
}
