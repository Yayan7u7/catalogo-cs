export type StaffTrustScores = Record<string, number | null>;

export async function getStaffTrustScores(
  backendApiUrl: string,
  token: string,
): Promise<StaffTrustScores> {
  try {
    const response = await fetch(`${backendApiUrl}/staff-onboarding/staff`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) return {};

    const staff = await response.json();
    return staff.reduce((scores: StaffTrustScores, member: any) => {
      const onboarding = member.onboarding;
      scores[member.id] =
        onboarding &&
        onboarding.attemptCount > 0 &&
        typeof onboarding.trustScore === "number"
          ? onboarding.trustScore
          : null;
      return scores;
    }, {});
  } catch (error) {
    console.error("getStaffTrustScores error:", error);
    return {};
  }
}
