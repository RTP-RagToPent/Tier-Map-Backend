class Memo {
  private constructor(private readonly value: string) {}

  public static of(value: string): Memo {
    return new Memo(value);
  }

  public getValue(): string {
    return this.value;
  }
}

export { Memo };
