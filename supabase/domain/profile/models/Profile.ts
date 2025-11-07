import { Id } from "./Id.ts";
import { Name } from "./Name.ts";

class Profile {
  private constructor(
    private readonly id: Id,
    private readonly name: Name,
  ) {}

  public static of(
    { id, name }: { id: number; name: string },
  ): Profile {
    return new Profile(Id.of(id), Name.of(name));
  }

  public getId(): Id {
    return this.id;
  }

  public getName(): Name {
    return this.name;
  }
}

export { Profile };
