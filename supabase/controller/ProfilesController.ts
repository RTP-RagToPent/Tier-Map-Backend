import { SupabaseProfileRepository } from "../infrastructure/supabase/repository/profile.ts";
import { ShowProfileUseCase } from "../usecase/profile/ShowUseCase.ts";
import {
  UpdateProfileUseCase,
  type UpdateProfileUseCaseRequest,
} from "../usecase/profile/UpdateUseCase.ts";

class ProfilesController {
  constructor(private accessToken: string) {}

  async show(userId: string) {
    const repository = new SupabaseProfileRepository(this.accessToken);
    const useCase = new ShowProfileUseCase(repository);
    return await useCase.execute(userId);
  }

  async update(request: UpdateProfileUseCaseRequest) {
    const repository = new SupabaseProfileRepository(this.accessToken);
    const useCase = new UpdateProfileUseCase(repository);
    return await useCase.execute(request);
  }
}

export { ProfilesController };
