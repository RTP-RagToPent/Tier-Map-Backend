class Stars {
  private constructor(private readonly value: number) {}

  public static of(value: number): Stars {
    if (!Number.isInteger(value) || value < 0 || value > 5) {
      throw new Error("Stars must be an integer between 0 and 5");
    }
    return new Stars(value);
  }

  public getValue(): number {
    return this.value;
  }
}

export { Stars };
