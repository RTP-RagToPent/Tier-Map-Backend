import { Genre } from "../../../domain/rally/models/Genre.ts";
import { Id } from "../../../domain/rally/models/Id.ts";
import { Name } from "../../../domain/rally/models/Name.ts";
import { Rally } from "../../../domain/rally/models/Rally.ts";
import type { IRallyRepository } from "../../../domain/rally/repository.ts";
import { createSupabaseClient } from "../client.ts";

class SupabaseRallyRepository implements IRallyRepository {
  private readonly client;

  constructor(accessToken: string) {
    this.client = createSupabaseClient(accessToken);
  }

  async list(profileId: number): Promise<Rally[]> {
    return await this.client.from("rallies")
      .select("id, name, genre")
      .order(
        "created_at",
        { ascending: false },
      )
      .eq("profile_id", profileId)
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error fetching rallies: ${error.message}`);
        }
        return data.map(
          (row) =>
            Rally.of({
              id: row.id,
              name: row.name,
              genre: row.genre,
            }),
        );
      });
  }

  async findById(rallyId: Id): Promise<Rally | null> {
    return await this.client.from("rallies")
      .select("id, name, genre")
      .eq(
        "id",
        rallyId.getValue(),
      )
      .single()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error fetching rally by ID: ${error.message}`);
        }
        return data
          ? Rally.of({ id: data.id, name: data.name, genre: data.genre })
          : null;
      });
  }

  async create(name: Name, genre: Genre, profileId: number): Promise<Rally> {
    return await this.client.from("rallies")
      .insert({
        name: name.getValue(),
        profile_id: profileId,
        genre: genre.getValue(),
      })
      .select("id, name, genre")
      .single()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error creating rally: ${error.message}`);
        }
        return Rally.of({
          id: data.id,
          name: data.name,
          genre: data.genre,
        });
      });
  }

  async update(rally: Rally): Promise<Rally> {
    return await this.client.from("rallies")
      .update({
        name: rally.getName().getValue(),
        genre: rally.getGenre().getValue(),
      })
      .eq("id", rally.getId().getValue())
      .select("id, name, genre")
      .single()
      .then(
        ({ data, error }) => {
          if (error) {
            throw new Error(`Error updating rally: ${error.message}`);
          }
          return Rally.of({
            id: data.id,
            name: data.name,
            genre: data.genre,
          });
        },
      );
  }

  async delete(rallyId: Id): Promise<void> {
    const { error } = await this.client.from("rallies")
      .delete()
      .eq("id", rallyId.getValue());

    if (error) {
      throw new Error(`Error deleting rally: ${error.message}`);
    }
  }
}

export { SupabaseRallyRepository };
