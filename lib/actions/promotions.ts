"use server";

import { apiFetch } from "@/lib/api-server";
import type { PromotionPayload } from "@/lib/promotions";

export async function previewPromotion(payload: PromotionPayload) {
  return apiFetch<{ matched: number; sample: Array<{ id: string; name: string; membershipLevel?: string; servicesCount?: number }> }>("/promotions/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function sendPromotion(payload: PromotionPayload) {
  return apiFetch<{ campaignId: string; matched: number; queued: number }>("/promotions/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
