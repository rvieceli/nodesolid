import { UsersRepositoryDrizzle } from "@/infra/database/repositories/users-repository.drizzle";
import { RegisterUseCase } from "./register.use-case";
import { BcryptService } from "@/infra/services/bcrypt.service";

export function registerUserCaseFactory() {
  const encryptionService = new BcryptService();
  const usersRepository = new UsersRepositoryDrizzle();

  const registerUseCase = new RegisterUseCase(
    usersRepository,
    encryptionService,
  );

  return registerUseCase;
}
