import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/users-repository";
import { UsersRepositoryInMemory } from "@/infra/database/repositories/users-repository.in-memory";
import { AuthenticateUseCase } from "./authenticate.use-case";
import { RegisterUseCase } from "./register.use-case";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import { BcryptService } from "@/infra/services/bcrypt.service";
import {
  REGISTER_USER_SAMPLE,
  REGISTER_WRONG_USER_SAMPLE,
} from "./test-samples/user.samples";

const DO_NOT_EXIST_EMAIL = "do_not_exists@notfound.com";

const encryptionService = new BcryptService();

describe("AuthenticateUseCase", () => {
  let usersRepository: UsersRepository;
  let registerUseCase: RegisterUseCase;
  let authenticateUseCase: AuthenticateUseCase;

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    registerUseCase = new RegisterUseCase(usersRepository, encryptionService);
    authenticateUseCase = new AuthenticateUseCase(
      usersRepository,
      encryptionService,
    );

    await registerUseCase.handler(REGISTER_USER_SAMPLE);
    await registerUseCase.handler(REGISTER_WRONG_USER_SAMPLE);
  });

  it("should be able to authenticate a user", async () => {
    const { user } = await authenticateUseCase.handler({
      email: REGISTER_USER_SAMPLE.email,
      password: REGISTER_USER_SAMPLE.password,
    });

    expect(user).toBeDefined();
    expect(user.email).toBe(REGISTER_USER_SAMPLE.email);
  });

  it("should not be able to authenticate a user that does not exist", async () => {
    await expect(() =>
      authenticateUseCase.handler({
        email: DO_NOT_EXIST_EMAIL,
        password: "I don't care",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("should not be able to authenticate a user with a wrong password", async () => {
    await expect(() =>
      authenticateUseCase.handler({
        email: REGISTER_USER_SAMPLE.email,
        password: REGISTER_WRONG_USER_SAMPLE.password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("should not be able to authenticate a user with a wrong email", async () => {
    await expect(() =>
      authenticateUseCase.handler({
        email: REGISTER_WRONG_USER_SAMPLE.email,
        password: REGISTER_USER_SAMPLE.password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("should not leak password or password_hash when authenticating a user", async () => {
    const { user } = await authenticateUseCase.handler({
      email: REGISTER_USER_SAMPLE.email,
      password: REGISTER_USER_SAMPLE.password,
    });

    expect(Object.keys(user)).not.toContain("password");
    expect(Object.keys(user)).not.toContain("password_hash");
  });
});
