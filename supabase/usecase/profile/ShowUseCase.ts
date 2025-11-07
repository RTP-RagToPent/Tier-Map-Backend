import type { IProfileRepository } from "../../domain/profile/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type ShowProfileUseCaseResponse = {
  id: number;
  name: string;
};

class ShowProfileUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(userId: string): Promise<ShowProfileUseCaseResponse | null> {
    try {
      const profile = await this.repository.findByUserId(userId);
      if (!profile) {
        return null;
      }

      return {
        id: profile.getId().getValue(),
        name: profile.getName().getValue(),
      };
    } catch (error) {
      errorLog({ title: "Failed to show profile", error });
      throw error;
    }
  }
}

export { ShowProfileUseCase };
