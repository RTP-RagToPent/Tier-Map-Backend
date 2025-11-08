import { SupabaseRallySpotRepository } from "../infrastructure/supabase/repository/rallySpot.ts";
import { SupabaseSpotRepository } from "../infrastructure/supabase/repository/spot.ts";
import {
  CreateRallySpotsUseCase,
  type CreateRallySpotsUseCaseRequest,
} from "../usecase/rallySpot/CreateUseCase.ts";
import { ListRallySpotsUseCase } from "../usecase/rallySpot/ListUseCase.ts";
import { ShowRallySpotUseCase } from "../usecase/rallySpot/ShowUseCase.ts";

class RallySpotsController {
  constructor(private accessToken: string) {}

  async list({ rallyId }: { rallyId: number }) {
    const repository = new SupabaseRallySpotRepository(this.accessToken);
    const useCase = new ListRallySpotsUseCase(repository);
    return await useCase.execute(rallyId);
  }

  async create(request: CreateRallySpotsUseCaseRequest) {
    const rallySpotRepository = new SupabaseRallySpotRepository(
      this.accessToken,
    );
    const spotRepository = new SupabaseSpotRepository(this.accessToken);
    const useCase = new CreateRallySpotsUseCase(
      rallySpotRepository,
      spotRepository,
    );
    return await useCase.execute(request);
  }

  async show({ rallyId, spotId }: { rallyId: number; spotId: string }) {
    const repository = new SupabaseRallySpotRepository(this.accessToken);
    const useCase = new ShowRallySpotUseCase(repository);
    return await useCase.execute(rallyId, spotId);
  }
}

export { RallySpotsController };
