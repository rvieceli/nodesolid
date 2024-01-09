import { describe, it, expect, beforeEach } from "vitest";
import { RegisterUseCase, RegisterUseCaseParams } from "./register.use-case";
import { UsersRepositoryInMemory } from "@/infra/database/repositories/users-repository.in-memory";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";

const sampleUser: RegisterUseCaseParams = {
  email: "example.com",
  name: "John Doe",
  password: "12345678",
};

describe("RegisterUseCase", () => {
  let usersRepository: UsersRepositoryInMemory;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    registerUseCase = new RegisterUseCase(usersRepository);
  });

  it("should be able to register a new user", async () => {
    const { user } = await registerUseCase.handler(sampleUser);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it("should not be able to register a new user with an email already in use", async () => {
    await registerUseCase.handler(sampleUser);

    await expect(() =>
      registerUseCase.handler(sampleUser),
    ).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });

  it("should be able to register a new user with a hashed password", async () => {
    const { user } = await registerUseCase.handler(sampleUser);

    expect(user).not.toHaveProperty("password");
    expect(user.password_hash).toBeDefined();
    expect(user.password_hash).not.toBe(sampleUser.password);
  });
});
