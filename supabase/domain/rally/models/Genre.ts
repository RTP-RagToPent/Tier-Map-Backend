class Genre {
  private constructor(private readonly value: string) {}

  private static validate(value: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Genre must be a non-empty string");
    }
  }

  public static of(value: string): Genre {
    this.validate(value);
    return new Genre(value);
  }

  public getValue(): string {
    return this.value;
  }
}

export { Genre };
