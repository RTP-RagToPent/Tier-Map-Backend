import type { IRallyRepository } from "../../domain/rally/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type ListRallyUseCaseResponse = {
  id: number;
  name: string;
  genre: string;
};

class ListRallyUseCase {
  constructor(private readonly repository: IRallyRepository) {}

  async execute(profileId: number): Promise<ListRallyUseCaseResponse[]> {
    try {
      const rallies = await this.repository.list(profileId);
      return rallies.map((rally) => ({
        id: rally.getId().getValue(),
        name: rally.getName().getValue(),
        genre: rally.getGenre().getValue(),
      }));
    } catch (error) {
      errorLog({ title: "Failed to list rallies", error });
      throw error;
    }
  }
}

export { ListRallyUseCase };
