import { Id } from "./Id.ts";
import { Name } from "./Name.ts";

class Spot {
  private constructor(
    private readonly id: Id,
    private readonly name: Name,
  ) {}

  public static of(
    { id, name }: { id: string; name: string },
  ): Spot {
    return new Spot(Id.of(id), Name.of(name));
  }

  public getId(): Id {
    return this.id;
  }

  public getName(): Name {
    return this.name;
  }
}

export { Spot };
