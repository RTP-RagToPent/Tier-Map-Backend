import { Id } from "../../domain/rally/models/Id.ts";
import type { IRallyRepository } from "../../domain/rally/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type ShowRallyUseCaseResponse = {
  id: number;
  name: string;
  genre: string;
};

class ShowRallyUseCase {
  constructor(private readonly repository: IRallyRepository) {}

  async execute(rallyId: number): Promise<ShowRallyUseCaseResponse | null> {
    try {
      const id = Id.of(rallyId);
      const rally = await this.repository.findById(id);

      if (!rally) {
        return null;
      }

      return {
        id: rally.getId().getValue(),
        name: rally.getName().getValue(),
        genre: rally.getGenre().getValue(),
      };
    } catch (error) {
      errorLog({ title: "Failed to show rally", error });
      throw error;
    }
  }
}

export { ShowRallyUseCase };
