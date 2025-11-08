import type {
  IRatingRepository,
  RallySpotWithRating,
} from "../../domain/rating/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type ListRatingsUseCaseResponse = RallySpotWithRating[];

class ListRatingsUseCase {
  constructor(private readonly repository: IRatingRepository) {}

  async execute(rallyId: number): Promise<ListRatingsUseCaseResponse> {
    try {
      const ratings = await this.repository.findRallySpotsWithRatings(rallyId);
      return ratings;
    } catch (error) {
      errorLog({ title: "Failed to list ratings", error });
      throw error;
    }
  }
}

export { ListRatingsUseCase };
