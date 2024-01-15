import { describe, it, expect, beforeEach } from "vitest";

import { RegisterUseCase } from "./register.use-case";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";

import { UsersRepositoryInMemory } from "@/infra/database/repositories/users-repository.in-memory";
import { BcryptService } from "@/infra/services/bcrypt.service";
import { REGISTER_USER_SAMPLE } from "./test-samples/user.samples";

const encryptionService = new BcryptService();

describe("RegisterUseCase", () => {
  let usersRepository: UsersRepositoryInMemory;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    registerUseCase = new RegisterUseCase(usersRepository, encryptionService);
  });

  it("should be able to register a new user", async () => {
    const { user } = await registerUseCase.handler(REGISTER_USER_SAMPLE);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it("should not be able to register a new user with an email already in use", async () => {
    await registerUseCase.handler(REGISTER_USER_SAMPLE);

    await expect(() =>
      registerUseCase.handler(REGISTER_USER_SAMPLE),
    ).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });

  it("should be able to register a new user with a hashed password", async () => {
    const { user } = await registerUseCase.handler(REGISTER_USER_SAMPLE);

    expect(user).not.toHaveProperty("password");
    expect(user.unsafe_get_password_hash()).toBeDefined();
    expect(user.unsafe_get_password_hash()).not.toBe(
      REGISTER_USER_SAMPLE.password,
    );
  });

  it("should not leak password or password_hash when registering a new user", async () => {
    const { user } = await registerUseCase.handler(REGISTER_USER_SAMPLE);

    expect(Object.keys(user)).not.toContain("password");
    expect(Object.keys(user)).not.toContain("password_hash");
  });
});
