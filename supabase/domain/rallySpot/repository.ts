import { Id as RallyId } from "../rally/models/Id.ts";
import { Id as SpotId } from "../spot/models/Id.ts";
import { RallySpot } from "./models/RallySpot.ts";

type IRallySpotRepository = {
  listByRallyId(rallyId: RallyId): Promise<RallySpot[]>;
  findByRallyIdAndSpotId(
    rallyId: RallyId,
    spotId: SpotId,
  ): Promise<RallySpot | null>;
  createMany(
    rallyId: RallyId,
    spots: { spotId: SpotId; orderNo: number }[],
  ): Promise<RallySpot[]>;
};

export type { IRallySpotRepository };
