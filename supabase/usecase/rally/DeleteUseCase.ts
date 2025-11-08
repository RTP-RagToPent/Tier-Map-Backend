import { Id } from "../../domain/rally/models/Id.ts";
import type { IRallyRepository } from "../../domain/rally/repository.ts";
import { errorLog } from "../../lib/log.ts";

class DeleteUseCase {
  constructor(private readonly repository: IRallyRepository) {}

  async execute(
    rallyId: number,
  ): Promise<void> {
    try {
      const id = Id.of(rallyId);

      await this.repository.delete(id);
    } catch (error) {
      errorLog({ title: "Failed to delete rally", error });
      throw error;
    }
  }
}

export { DeleteUseCase };
