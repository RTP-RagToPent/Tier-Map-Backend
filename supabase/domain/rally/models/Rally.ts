import { Genre } from "./Genre.ts";
import { Id } from "./Id.ts";
import { Name } from "./Name.ts";

class Rally {
  private constructor(
    private readonly id: Id,
    private readonly name: Name,
    private readonly genre: Genre,
  ) {}

  public static of(
    { id, name, genre }: { id: number; name: string; genre: string },
  ): Rally {
    return new Rally(Id.of(id), Name.of(name), Genre.of(genre));
  }

  public getId(): Id {
    return this.id;
  }

  public getName(): Name {
    return this.name;
  }

  public getGenre(): Genre {
    return this.genre;
  }
}

export { Rally };
