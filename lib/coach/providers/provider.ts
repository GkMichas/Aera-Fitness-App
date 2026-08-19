import type { CoachProviderInput, CoachProviderOutput } from "@/types/coach";

export interface CoachProvider {
  readonly name: string;
  complete(input: CoachProviderInput): Promise<CoachProviderOutput>;
}
