import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/users-repository";
import { UsersRepositoryInMemory } from "@/infra/database/repositories/users-repository.in-memory";
import { AuthenticateUseCase } from "./authenticate.use-case";
import { RegisterUseCase, RegisterUseCaseParams } from "./register.use-case";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import { BcryptService } from "@/infra/services/bcrypt.service";

const SAMPLE_USER: RegisterUseCaseParams = {
  email: "john@example.com",
  name: "John Doe",
  password: "12345678",
};

const WRONG_USER: RegisterUseCaseParams = {
  email: "wrong-email@wrong.com",
  name: "John Wrong",
  password: "wrong-password",
};

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

    await registerUseCase.handler(SAMPLE_USER);
    await registerUseCase.handler(WRONG_USER);
  });

  it("should be able to authenticate a user", async () => {
    const { user } = await authenticateUseCase.handler({
      email: SAMPLE_USER.email,
      password: SAMPLE_USER.password,
    });

    expect(user).toBeDefined();
    expect(user.email).toBe(SAMPLE_USER.email);
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
        email: SAMPLE_USER.email,
        password: WRONG_USER.password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it("should not be able to authenticate a user with a wrong email", async () => {
    await expect(() =>
      authenticateUseCase.handler({
        email: WRONG_USER.email,
        password: SAMPLE_USER.password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException);
  });
});
