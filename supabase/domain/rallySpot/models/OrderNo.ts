class OrderNo {
  private constructor(private readonly value: number) {}

  public static of(value: number): OrderNo {
    if (value < 0) {
      throw new Error("Order number cannot be negative");
    }
    return new OrderNo(value);
  }

  public getValue(): number {
    return this.value;
  }
}

export { OrderNo };
