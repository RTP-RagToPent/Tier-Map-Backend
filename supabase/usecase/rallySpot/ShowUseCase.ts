import { Id as RallyId } from "../../domain/rally/models/Id.ts";
import type { IRallySpotRepository } from "../../domain/rallySpot/repository.ts";
import { Id as SpotId } from "../../domain/spot/models/Id.ts";
import { errorLog } from "../../lib/log.ts";

export type ShowRallySpotUseCaseResponse = {
  id: string;
  name: string;
  order_no: number;
};

class ShowRallySpotUseCase {
  constructor(private readonly repository: IRallySpotRepository) {}

  async execute(
    rallyId: number,
    spotId: string,
  ): Promise<ShowRallySpotUseCaseResponse | null> {
    try {
      const rallySpot = await this.repository.findByRallyIdAndSpotId(
        RallyId.of(rallyId),
        SpotId.of(spotId),
      );

      if (!rallySpot) {
        return null;
      }

      return {
        id: rallySpot.getSpotId().getValue(),
        name: rallySpot.getSpotName().getValue(),
        order_no: rallySpot.getOrderNo().getValue(),
      };
    } catch (error) {
      errorLog({ title: "Failed to show rally spot", error });
      throw error;
    }
  }
}

export { ShowRallySpotUseCase };
