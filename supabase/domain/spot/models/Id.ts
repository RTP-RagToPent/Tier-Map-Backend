class Id {
  private constructor(private readonly value: string) {}

  public static of(value: string): Id {
    if (!value || value.trim().length === 0) {
      throw new Error("Spot ID cannot be empty");
    }
    return new Id(value);
  }

  public getValue(): string {
    return this.value;
  }
}

export { Id };
