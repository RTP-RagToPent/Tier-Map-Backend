import { Name } from "../../domain/profile/models/Name.ts";
import type { IProfileRepository } from "../../domain/profile/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type UpdateProfileUseCaseRequest = {
  userId: string;
  name: string;
};

export type UpdateProfileUseCaseResponse = {
  id: number;
  name: string;
};

class UpdateProfileUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(
    request: UpdateProfileUseCaseRequest,
  ): Promise<UpdateProfileUseCaseResponse> {
    try {
      const name = Name.of(request.name);

      const updatedProfile = await this.repository.updateByUserId(
        request.userId,
        name,
      );

      return {
        id: updatedProfile.getId().getValue(),
        name: updatedProfile.getName().getValue(),
      };
    } catch (error) {
      errorLog({ title: "Failed to update profile", error });
      throw error;
    }
  }
}

export { UpdateProfileUseCase };
