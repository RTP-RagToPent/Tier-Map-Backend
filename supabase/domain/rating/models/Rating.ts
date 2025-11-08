import { Id } from "./Id.ts";
import { Memo } from "./Memo.ts";
import { Stars } from "./Stars.ts";

class Rating {
  private constructor(
    private readonly id: Id,
    private readonly rallySpotId: number,
    private readonly stars: Stars,
    private readonly memo: Memo,
  ) {}

  public static of({
    id,
    rallySpotId,
    stars,
    memo,
  }: {
    id: number;
    rallySpotId: number;
    stars: number;
    memo: string;
  }): Rating {
    return new Rating(
      Id.of(id),
      rallySpotId,
      Stars.of(stars),
      Memo.of(memo),
    );
  }

  public getId(): Id {
    return this.id;
  }

  public getRallySpotId(): number {
    return this.rallySpotId;
  }

  public getStars(): Stars {
    return this.stars;
  }

  public getMemo(): Memo {
    return this.memo;
  }
}

export { Rating };
