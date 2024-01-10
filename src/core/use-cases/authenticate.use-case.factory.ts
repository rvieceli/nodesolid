import { UsersRepositoryDrizzle } from "@/infra/database/repositories/users-repository.drizzle";
import { BcryptService } from "@/infra/services/bcrypt.service";
import { AuthenticateUseCase } from "./authenticate.use-case";

export function authenticateUserCaseFactory() {
  const encryptionService = new BcryptService();
  const usersRepository = new UsersRepositoryDrizzle();

  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    encryptionService,
  );

  return authenticateUseCase;
}
