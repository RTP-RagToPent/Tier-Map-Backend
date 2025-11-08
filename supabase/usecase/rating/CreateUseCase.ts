import { Memo } from "../../domain/rating/models/Memo.ts";
import { Stars } from "../../domain/rating/models/Stars.ts";
import type {
  IRatingRepository,
  RallySpotWithRating,
} from "../../domain/rating/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type CreateRatingUseCaseInput = {
  rallyId: number;
  spotId: string;
  stars: number;
  memo: string;
};

export type CreateRatingUseCaseResponse = RallySpotWithRating;

class CreateRatingUseCase {
  constructor(private readonly repository: IRatingRepository) {}

  async execute(
    input: CreateRatingUseCaseInput,
  ): Promise<CreateRatingUseCaseResponse> {
    try {
      const starsObj = Stars.of(input.stars);
      const memoObj = Memo.of(input.memo);

      await this.repository.ensureSpotExists(input.spotId);

      const rallySpot = await this.repository.findOrCreateRallySpot(
        input.rallyId,
        input.spotId,
      );

      await this.repository.upsertRating(
        rallySpot.id,
        starsObj.getValue(),
        memoObj.getValue(),
      );

      const result = await this.repository.getRallySpotWithRatingById(
        rallySpot.id,
      );

      if (!result) {
        throw new Error("Failed to retrieve created rating");
      }

      return result;
    } catch (error) {
      errorLog({ title: "Failed to create rating", error });
      throw error;
    }
  }
}

export { CreateRatingUseCase };
