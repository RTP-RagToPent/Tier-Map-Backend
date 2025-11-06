import { Rally } from "../../domain/rally/models/Rally.ts";
import type { IRallyRepository } from "../../domain/rally/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type UpdateRallyUseCaseRequest = {
  id: number;
  name: string;
  genre: string;
};

export type UpdateRallyUseCaseResponse = {
  id: number;
  name: string;
  genre: string;
};

class UpdateRallyUseCase {
  constructor(private readonly repository: IRallyRepository) {}

  async execute(
    request: UpdateRallyUseCaseRequest,
  ): Promise<UpdateRallyUseCaseResponse> {
    try {
      const rally = Rally.of({
        id: request.id,
        name: request.name,
        genre: request.genre,
      });

      const updatedRally = await this.repository.update(rally);

      return {
        id: updatedRally.getId().getValue(),
        name: updatedRally.getName().getValue(),
        genre: updatedRally.getGenre().getValue(),
      };
    } catch (error) {
      errorLog({ title: "Failed to update rally", error });
      throw error;
    }
  }
}

export { UpdateRallyUseCase };
