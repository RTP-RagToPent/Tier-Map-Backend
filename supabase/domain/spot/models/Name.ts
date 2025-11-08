class Name {
  private constructor(private readonly value: string) {}

  public static of(value: string): Name {
    if (!value || value.trim().length === 0) {
      throw new Error("Spot name cannot be empty");
    }
    return new Name(value);
  }

  public getValue(): string {
    return this.value;
  }
}

export { Name };
