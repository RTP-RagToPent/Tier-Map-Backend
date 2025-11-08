import { Id as RallyId } from "../../domain/rally/models/Id.ts";
import type { IRallySpotRepository } from "../../domain/rallySpot/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type ListRallySpotsUseCaseResponse = {
  id: string;
  name: string;
  order_no: number;
};

class ListRallySpotsUseCase {
  constructor(private readonly repository: IRallySpotRepository) {}

  async execute(rallyId: number): Promise<ListRallySpotsUseCaseResponse[]> {
    try {
      const rallySpots = await this.repository.listByRallyId(
        RallyId.of(rallyId),
      );
      return rallySpots.map((rallySpot) => ({
        id: rallySpot.getSpotId().getValue(),
        name: rallySpot.getSpotName().getValue(),
        order_no: rallySpot.getOrderNo().getValue(),
      }));
    } catch (error) {
      errorLog({ title: "Failed to list rally spots", error });
      throw error;
    }
  }
}

export { ListRallySpotsUseCase };
