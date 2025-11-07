import { SupabaseRallyRepository } from "../infrastructure/supabase/repository/rally.ts";
import {
  CreateRallyUseCase,
  type CreateRallyUseCaseRequest,
} from "../usecase/rally/CreateUseCase.ts";
import { ListRallyUseCase } from "../usecase/rally/ListUseCase.ts";
import { ShowRallyUseCase } from "../usecase/rally/ShowUseCase.ts";
import {
  UpdateRallyUseCase,
  type UpdateRallyUseCaseRequest,
} from "../usecase/rally/UpdateUseCase.ts";

class RalliesController {
  constructor(private accessToken: string) {}

  async index({ profileId }: { profileId: number }) {
    const repository = new SupabaseRallyRepository(this.accessToken);
    const useCase = new ListRallyUseCase(repository);
    return await useCase.execute(profileId);
  }

  async create(request: CreateRallyUseCaseRequest) {
    const repository = new SupabaseRallyRepository(this.accessToken);
    const useCase = new CreateRallyUseCase(repository);
    return await useCase.execute(request);
  }

  async show(rallyId: number) {
    const repository = new SupabaseRallyRepository(this.accessToken);
    const useCase = new ShowRallyUseCase(repository);
    return await useCase.execute(rallyId);
  }

  async update(request: UpdateRallyUseCaseRequest) {
    const repository = new SupabaseRallyRepository(this.accessToken);
    const useCase = new UpdateRallyUseCase(repository);
    return await useCase.execute(request);
  }
}

export { RalliesController };
