export abstract class InMemory {
  constructor() {
    if (process.env.NODE_ENV === "production")
      throw new Error("Cannot use this repository in production");
  }
}
