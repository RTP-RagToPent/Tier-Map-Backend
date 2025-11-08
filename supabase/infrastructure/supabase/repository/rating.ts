import type {
  IRatingRepository,
  RallySpotWithRating,
} from "../../../domain/rating/repository.ts";
import { createSupabaseClient } from "../client.ts";

class SupabaseRatingRepository implements IRatingRepository {
  private readonly client;

  constructor(accessToken: string) {
    this.client = createSupabaseClient(accessToken);
  }

  async findRallySpotsWithRatings(
    rallyId: number,
  ): Promise<RallySpotWithRating[]> {
    const { data, error } = await this.client
      .from("rallyspots")
      .select(`
        id,
        spot_id,
        order_no,
        spots (
          name
        ),
        ratings (
          stars,
          memo
        )
      `)
      .eq("rally_id", rallyId)
      .order("order_no", { ascending: true });

    if (error) {
      throw new Error(
        `Error fetching rally spots with ratings: ${error.message}`,
      );
    }

    return data.map((row) => {
      const spots = Array.isArray(row.spots) ? row.spots[0] : row.spots;
      const ratings = Array.isArray(row.ratings) ? row.ratings[0] : row.ratings;

      return {
        id: row.id,
        spot_id: row.spot_id,
        name: spots?.name || null,
        order_no: row.order_no,
        stars: ratings?.stars || null,
        memo: ratings?.memo || null,
      };
    });
  }

  async findRallySpotWithRating(
    rallyId: number,
    spotId: string,
  ): Promise<RallySpotWithRating | null> {
    const { data, error } = await this.client
      .from("rallyspots")
      .select(`
        id,
        spot_id,
        order_no,
        spots (
          name
        ),
        ratings (
          stars,
          memo
        )
      `)
      .eq("rally_id", rallyId)
      .eq("spot_id", spotId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error fetching rally spot with rating: ${error.message}`,
      );
    }

    if (!data) {
      return null;
    }

    const spots = Array.isArray(data.spots) ? data.spots[0] : data.spots;
    const ratings = Array.isArray(data.ratings)
      ? data.ratings[0]
      : data.ratings;

    return {
      id: data.id,
      spot_id: data.spot_id,
      name: spots?.name || null,
      order_no: data.order_no,
      stars: ratings?.stars || null,
      memo: ratings?.memo || null,
    };
  }

  async ensureSpotExists(spotId: string, name?: string): Promise<void> {
    const { data: existingSpot, error: selectError } = await this.client
      .from("spots")
      .select("id")
      .eq("id", spotId)
      .maybeSingle();

    if (selectError) {
      throw new Error(`Error checking spot existence: ${selectError.message}`);
    }

    if (!existingSpot) {
      const { error: insertError } = await this.client
        .from("spots")
        .insert({
          id: spotId,
          name: name || spotId,
        });

      if (insertError) {
        throw new Error(`Error creating spot: ${insertError.message}`);
      }
    }
  }

  async findOrCreateRallySpot(
    rallyId: number,
    spotId: string,
  ): Promise<{ id: number; order_no: number }> {
    const { data: existingRallySpot, error: selectError } = await this.client
      .from("rallyspots")
      .select("id, order_no")
      .eq("rally_id", rallyId)
      .eq("spot_id", spotId)
      .maybeSingle();

    if (selectError) {
      throw new Error(
        `Error checking rally spot existence: ${selectError.message}`,
      );
    }

    if (existingRallySpot) {
      return {
        id: existingRallySpot.id,
        order_no: existingRallySpot.order_no,
      };
    }

    const { data: maxOrderData, error: maxOrderError } = await this.client
      .from("rallyspots")
      .select("order_no")
      .eq("rally_id", rallyId)
      .order("order_no", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxOrderError) {
      throw new Error(`Error getting max order_no: ${maxOrderError.message}`);
    }

    const nextOrderNo = maxOrderData ? maxOrderData.order_no + 1 : 1;

    const { data: newRallySpot, error: insertError } = await this.client
      .from("rallyspots")
      .insert({
        rally_id: rallyId,
        spot_id: spotId,
        order_no: nextOrderNo,
      })
      .select("id, order_no")
      .single();

    if (insertError) {
      throw new Error(`Error creating rally spot: ${insertError.message}`);
    }

    return {
      id: newRallySpot.id,
      order_no: newRallySpot.order_no,
    };
  }

  async upsertRating(
    rallySpotId: number,
    stars: number,
    memo: string,
  ): Promise<void> {
    const { error } = await this.client
      .from("ratings")
      .upsert(
        {
          rally_spot_id: rallySpotId,
          stars,
          memo,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "rally_spot_id",
        },
      );

    if (error) {
      throw new Error(`Error upserting rating: ${error.message}`);
    }
  }

  async getRallySpotWithRatingById(
    rallySpotId: number,
  ): Promise<RallySpotWithRating | null> {
    const { data, error } = await this.client
      .from("rallyspots")
      .select(`
        id,
        spot_id,
        order_no,
        spots (
          name
        ),
        ratings (
          stars,
          memo
        )
      `)
      .eq("id", rallySpotId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error fetching rally spot with rating by ID: ${error.message}`,
      );
    }

    if (!data) {
      return null;
    }

    const spots = Array.isArray(data.spots) ? data.spots[0] : data.spots;
    const ratings = Array.isArray(data.ratings)
      ? data.ratings[0]
      : data.ratings;

    return {
      id: data.id,
      spot_id: data.spot_id,
      name: spots?.name || null,
      order_no: data.order_no,
      stars: ratings?.stars || null,
      memo: ratings?.memo || null,
    };
  }
}

export { SupabaseRatingRepository };
