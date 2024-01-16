import { beforeAll, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/users.repository";
import { RegisterUseCase } from "./register.use-case";
import { UsersRepositoryInMemory } from "@/infra/database/repositories/users-repository.in-memory";
import { BcryptService } from "@/infra/services/bcrypt.service";
import { REGISTER_USER_SAMPLE } from "./test-samples/user.samples";
import { GetUserProfileUseCase } from "./get-user-profile.use-case";
import { randomUUID } from "node:crypto";
import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";

const encryptionService = new BcryptService();

describe("GetUserProfileUseCase", () => {
  let usersRepository: UsersRepository;
  let registerUseCase: RegisterUseCase;
  let getUserProfileUseCase: GetUserProfileUseCase;
  let userId: string;

  beforeAll(async () => {
    usersRepository = new UsersRepositoryInMemory();
    registerUseCase = new RegisterUseCase(usersRepository, encryptionService);
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    const { user } = await registerUseCase.handler(REGISTER_USER_SAMPLE);

    userId = user.id;
  });

  it("should return a user profile", async () => {
    const { user } = await getUserProfileUseCase.handler(userId);

    expect(user).toHaveProperty("id", userId);
  });

  it("should throw an exception if the user does not exist", async () => {
    const rejected = expect(async () =>
      getUserProfileUseCase.handler(randomUUID()),
    ).rejects;

    rejected.toBeInstanceOf(ResourceNotFoundException);
    rejected.toThrowError(new ResourceNotFoundException("User"));
  });

  it("should not leak password or password_hash when registering a new user", async () => {
    const { user } = await getUserProfileUseCase.handler(userId);

    expect(Object.keys(user)).not.toContain("password");
    expect(Object.keys(user)).not.toContain("password_hash");
  });
});
