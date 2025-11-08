import { Genre } from "./models/Genre.ts";
import { Id } from "./models/Id.ts";
import { Name } from "./models/Name.ts";
import { Rally } from "./models/Rally.ts";

type IRallyRepository = {
  list(profileId: number): Promise<Rally[]>;
  findById(rallyId: Id): Promise<Rally | null>;
  create(name: Name, genre: Genre, profileId: number): Promise<Rally>;
  update(rally: Rally): Promise<Rally>;
  delete(rallyId: Id): Promise<void>;
};

export type { IRallyRepository };
