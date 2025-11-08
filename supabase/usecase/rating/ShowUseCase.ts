import type {
  IRatingRepository,
  RallySpotWithRating,
} from "../../domain/rating/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type ShowRatingUseCaseResponse = RallySpotWithRating | null;

class ShowRatingUseCase {
  constructor(private readonly repository: IRatingRepository) {}

  async execute(
    rallyId: number,
    spotId: string,
  ): Promise<ShowRatingUseCaseResponse> {
    try {
      const rating = await this.repository.findRallySpotWithRating(
        rallyId,
        spotId,
      );
      return rating;
    } catch (error) {
      errorLog({ title: "Failed to show rating", error });
      throw error;
    }
  }
}

export { ShowRatingUseCase };
