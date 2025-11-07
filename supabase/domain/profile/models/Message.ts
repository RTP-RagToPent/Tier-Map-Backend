/**
 * Profile Message Value Object
 * プロフィールメッセージを表すバリューオブジェクト
 */
class Message {
  private constructor(private readonly value: string) {}

  private static validate(value: string): void {
    if (typeof value !== "string") {
      throw new Error("Message must be a string");
    }
  }

  public static of(value: string): Message {
    this.validate(value);
    return new Message(value);
  }

  public getValue(): string {
    return this.value;
  }
}

export { Message };
