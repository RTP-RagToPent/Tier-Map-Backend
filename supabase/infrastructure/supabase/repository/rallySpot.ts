import { Id as RallyId } from "../../../domain/rally/models/Id.ts";
import { RallySpot } from "../../../domain/rallySpot/models/RallySpot.ts";
import type { IRallySpotRepository } from "../../../domain/rallySpot/repository.ts";
import { Id as SpotId } from "../../../domain/spot/models/Id.ts";
import { createSupabaseClient } from "../client.ts";

type RallySpotWithSpot = {
  order_no: number;
  spot_id: string;
  spots: {
    id: string;
    name: string;
  };
};

class SupabaseRallySpotRepository implements IRallySpotRepository {
  private readonly client;

  constructor(accessToken: string) {
    this.client = createSupabaseClient(accessToken);
  }

  async listByRallyId(rallyId: RallyId): Promise<RallySpot[]> {
    return await this.client.from("rallyspots")
      .select(`
        order_no,
        spot_id,
        spots!inner (
          id,
          name
        )
      `)
      .eq("rally_id", rallyId.getValue())
      .order("order_no", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error fetching rally spots: ${error.message}`);
        }
        return (data as unknown as RallySpotWithSpot[]).map((row) => {
          const spot = row.spots;

          if (!spot) {
            throw new Error("Associated spot data is missing");
          }

          return RallySpot.of({
            spotId: spot.id,
            spotName: spot.name,
            orderNo: row.order_no,
          });
        });
      });
  }

  async findByRallyIdAndSpotId(
    rallyId: RallyId,
    spotId: SpotId,
  ): Promise<RallySpot | null> {
    return await this.client.from("rallyspots")
      .select(`
        order_no,
        spot_id,
        spots!inner (
          id,
          name
        )
      `)
      .eq("rally_id", rallyId.getValue())
      .eq("spot_id", spotId.getValue())
      .single()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(
            `Error fetching rally spot by ID: ${error.message}`,
          );
        }
        const typedData = data as unknown as RallySpotWithSpot;
        const spot = typedData?.spots;

        return (typedData && spot)
          ? RallySpot.of({
            spotId: spot.id,
            spotName: spot.name,
            orderNo: typedData.order_no,
          })
          : null;
      });
  }

  async createMany(
    rallyId: RallyId,
    spots: { spotId: SpotId; orderNo: number }[],
  ): Promise<RallySpot[]> {
    const insertData = spots.map((spot) => ({
      rally_id: rallyId.getValue(),
      spot_id: spot.spotId.getValue(),
      order_no: spot.orderNo,
    }));

    return await this.client.from("rallyspots")
      .insert(insertData)
      .select(`
        order_no,
        spot_id,
        spots!inner (
          id,
          name
        )
      `)
      .then(({ data, error }) => {
        if (error) {
          throw new Error(`Error creating rally spots: ${error.message}`);
        }
        return (data as unknown as RallySpotWithSpot[]).map((row) => {
          const spot = row.spots;
          if (!spot) {
            throw new Error("createMany Associated spot data is missing");
          }

          return RallySpot.of({
            spotId: spot.id,
            spotName: spot.name,
            orderNo: row.order_no,
          });
        });
      });
  }
}

export { SupabaseRallySpotRepository };
