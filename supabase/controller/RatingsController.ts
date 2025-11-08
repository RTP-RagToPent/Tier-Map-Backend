import { SupabaseRatingRepository } from "../infrastructure/supabase/repository/rating.ts";
import {
  CreateRatingUseCase,
  type CreateRatingUseCaseInput,
} from "../usecase/rating/CreateUseCase.ts";
import { ListRatingsUseCase } from "../usecase/rating/ListUseCase.ts";
import { ShowRatingUseCase } from "../usecase/rating/ShowUseCase.ts";

class RatingsController {
  constructor(private accessToken: string) {}

  async index(rallyId: number) {
    const repository = new SupabaseRatingRepository(this.accessToken);
    const useCase = new ListRatingsUseCase(repository);
    return await useCase.execute(rallyId);
  }

  async show(rallyId: number, spotId: string) {
    const repository = new SupabaseRatingRepository(this.accessToken);
    const useCase = new ShowRatingUseCase(repository);
    return await useCase.execute(rallyId, spotId);
  }

  async create(request: CreateRatingUseCaseInput) {
    const repository = new SupabaseRatingRepository(this.accessToken);
    const useCase = new CreateRatingUseCase(repository);
    return await useCase.execute(request);
  }
}

export { RatingsController };
