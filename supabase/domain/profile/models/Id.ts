class Id {
  private constructor(private readonly value: number) {}

  private static validate(value: number): void {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("ID must be a positive integer");
    }
  }

  public static of(value: number): Id {
    this.validate(value);
    return new Id(value);
  }

  public getValue(): number {
    return this.value;
  }
}

export { Id };
