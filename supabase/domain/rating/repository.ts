export type RallySpotWithRating = {
  id: number;
  spot_id: string;
  name: string | null;
  order_no: number;
  stars: number | null;
  memo: string | null;
};

export type CreateRatingInput = {
  spot_id: string;
  stars: number;
  memo: string;
};

export type IRatingRepository = {
  findRallySpotsWithRatings(rallyId: number): Promise<RallySpotWithRating[]>;
  findRallySpotWithRating(
    rallyId: number,
    spotId: string,
  ): Promise<RallySpotWithRating | null>;
  ensureSpotExists(spotId: string, name?: string): Promise<void>;
  findOrCreateRallySpot(
    rallyId: number,
    spotId: string,
  ): Promise<{ id: number; order_no: number }>;
  upsertRating(
    rallySpotId: number,
    stars: number,
    memo: string,
  ): Promise<void>;
  getRallySpotWithRatingById(
    rallySpotId: number,
  ): Promise<RallySpotWithRating | null>;
};
