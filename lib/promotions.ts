export const PROMOTION_TONES = ["coqueta", "cachonda", "juguetona"] as const;

export type PromotionTone = (typeof PROMOTION_TONES)[number];

export type PromotionFilters = {
  membershipLevel?: string;
  minimumServices?: number;
  inactiveDays?: number;
  onlyWithTelegram?: boolean;
};

export type PromotionPayload = {
  offer: string;
  tone: PromotionTone;
  filters: PromotionFilters;
};
