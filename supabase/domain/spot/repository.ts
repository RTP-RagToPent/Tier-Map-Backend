import { Id } from "./models/Id.ts";
import { Name } from "./models/Name.ts";
import { Spot } from "./models/Spot.ts";

type ISpotRepository = {
  findById(spotId: Id): Promise<Spot | null>;
  create(id: Id, name: Name): Promise<Spot>;
  createMany(spots: { id: Id; name: Name }[]): Promise<Spot[]>;
};

export type { ISpotRepository };
