import { Genre } from "../../domain/rally/models/Genre.ts";
import { Name } from "../../domain/rally/models/Name.ts";
import type { IRallyRepository } from "../../domain/rally/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type CreateRallyUseCaseRequest = {
  name: string;
  genre: string;
};

export type CreateRallyUseCaseResponse = {
  id: number;
  name: string;
  genre: string;
};

class CreateRallyUseCase {
  constructor(private readonly repository: IRallyRepository) {}

  async execute(
    request: CreateRallyUseCaseRequest,
  ): Promise<CreateRallyUseCaseResponse> {
    try {
      const name = Name.of(request.name);
      const genre = Genre.of(request.genre);

      const rally = await this.repository.create(name, genre);

      return {
        id: rally.getId().getValue(),
        name: rally.getName().getValue(),
        genre: rally.getGenre().getValue(),
      };
    } catch (error) {
      errorLog({ title: "Failed to create rally", error });
      throw error;
    }
  }
}

export { CreateRallyUseCase };
