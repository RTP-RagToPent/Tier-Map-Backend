import { Id } from "../../../domain/spot/models/Id.ts";
import { Name } from "../../../domain/spot/models/Name.ts";
import { Spot } from "../../../domain/spot/models/Spot.ts";
import type { ISpotRepository } from "../../../domain/spot/repository.ts";
import { createSupabaseClient } from "../client.ts";

class SupabaseSpotRepository implements ISpotRepository {
  private readonly client;

  constructor(accessToken: string) {
    this.client = createSupabaseClient(accessToken);
  }

  async findById(spotId: Id): Promise<Spot | null> {
    return await this.client.from("spots")
      .select("id, name")
      .eq("id", spotId.getValue())
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error fetching spot by ID: ${error.message}`);
        }
        return data ? Spot.of({ id: data.id, name: data.name }) : null;
      });
  }

  async create(id: Id, name: Name): Promise<Spot> {
    return await this.client.from("spots")
      .insert({
        id: id.getValue(),
        name: name.getValue(),
      })
      .select("id, name")
      .single()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error creating spot: ${error.message}`);
        }
        return Spot.of({
          id: data.id,
          name: data.name,
        });
      });
  }

  async createMany(spots: { id: Id; name: Name }[]): Promise<Spot[]> {
    const insertData = spots.map((spot) => ({
      id: spot.id.getValue(),
      name: spot.name.getValue(),
    }));

    return await this.client.from("spots")
      .insert(insertData)
      .select("id, name")
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error creating spots: ${error.message}`);
        }
        return data.map((row) =>
          Spot.of({
            id: row.id,
            name: row.name,
          })
        );
      });
  }
}

export { SupabaseSpotRepository };
