import { Name } from "./models/Name.ts";
import { Profile } from "./models/Profile.ts";

type IProfileRepository = {
  findByUserId(userId: string): Promise<Profile | null>;
  updateByUserId(userId: string, name: Name): Promise<Profile>;
};

export type { IProfileRepository };
