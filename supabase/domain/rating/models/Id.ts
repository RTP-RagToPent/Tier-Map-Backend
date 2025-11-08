class Id {
  private constructor(private readonly value: number) {}

  public static of(value: number): Id {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("ID must be a positive integer");
    }
    return new Id(value);
  }

  public getValue(): number {
    return this.value;
  }
}

export { Id };
