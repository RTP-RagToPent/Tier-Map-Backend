class Name {
  private constructor(private readonly value: string) {}

  private static validate(value: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Name must be a non-empty string");
    }
  }

  public static of(value: string): Name {
    this.validate(value);
    return new Name(value);
  }

  public getValue(): string {
    return this.value;
  }
}

export { Name };
