import { Id as RallyId } from "../../domain/rally/models/Id.ts";
import type { IRallySpotRepository } from "../../domain/rallySpot/repository.ts";
import { Id as SpotId } from "../../domain/spot/models/Id.ts";
import { Name as SpotName } from "../../domain/spot/models/Name.ts";
import type { ISpotRepository } from "../../domain/spot/repository.ts";
import { errorLog } from "../../lib/log.ts";

export type CreateRallySpotsUseCaseRequest = {
  rallyId: number;
  spots: {
    spot_id: string;
    name: string;
    order_no: number;
  }[];
};

export type CreateRallySpotsUseCaseResponse = {
  id: string;
  name: string;
  order_no: number;
};

class CreateRallySpotsUseCase {
  constructor(
    private readonly rallySpotRepository: IRallySpotRepository,
    private readonly spotRepository: ISpotRepository,
  ) {}

  async execute(
    request: CreateRallySpotsUseCaseRequest,
  ): Promise<CreateRallySpotsUseCaseResponse[]> {
    try {
      const { rallyId, spots } = request;

      const spotsToCreate: { id: SpotId; name: SpotName }[] = [];
      for (const spot of spots) {
        const existingSpot = await this.spotRepository.findById(
          SpotId.of(spot.spot_id),
        );
        if (!existingSpot) {
          spotsToCreate.push({
            id: SpotId.of(spot.spot_id),
            name: SpotName.of(spot.name),
          });
        }
      }

      if (spotsToCreate.length > 0) {
        await this.spotRepository.createMany(spotsToCreate);
      }

      const rallySpots = await this.rallySpotRepository.createMany(
        RallyId.of(rallyId),
        spots.map((spot) => ({
          spotId: SpotId.of(spot.spot_id),
          orderNo: spot.order_no,
        })),
      );

      return rallySpots.map((rallySpot) => ({
        id: rallySpot.getSpotId().getValue(),
        name: rallySpot.getSpotName().getValue(),
        order_no: rallySpot.getOrderNo().getValue(),
      }));
    } catch (error) {
      errorLog({ title: "Failed to create rally spots", error });
      throw error;
    }
  }
}

export { CreateRallySpotsUseCase };
