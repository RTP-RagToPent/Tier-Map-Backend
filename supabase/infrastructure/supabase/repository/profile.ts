import { Name } from "../../../domain/profile/models/Name.ts";
import { Profile } from "../../../domain/profile/models/Profile.ts";
import type { IProfileRepository } from "../../../domain/profile/repository.ts";
import { createSupabaseClient } from "../client.ts";

class SupabaseProfileRepository implements IProfileRepository {
  private readonly client;

  constructor(accessToken: string) {
    this.client = createSupabaseClient(accessToken);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return await this.client.from("profiles")
      .select("id, name")
      .eq("user_id", userId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(
            `fetching profile by user_id: ${error.message}`,
          );
        }
        return data ? Profile.of({ id: data.id, name: data.name }) : null;
      });
  }

  async updateByUserId(userId: string, name: Name): Promise<Profile> {
    return await this.client.from("profiles")
      .update({
        name: name.getValue(),
      })
      .eq("user_id", userId)
      .select("id, name")
      .single()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`updating profile by user_id: ${error.message}`);
        }
        return Profile.of({ id: data.id, name: data.name });
      });
  }
}

export { SupabaseProfileRepository };
