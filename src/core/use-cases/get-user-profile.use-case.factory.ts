import { UsersRepositoryDrizzle } from "@/infra/database/repositories/users-repository.drizzle";
import { GetUserProfileUseCase } from "./get-user-profile.use-case";

export function getUserProfileUserCaseFactory() {
  const usersRepository = new UsersRepositoryDrizzle();

  const registerUseCase = new GetUserProfileUseCase(usersRepository);

  return registerUseCase;
}
