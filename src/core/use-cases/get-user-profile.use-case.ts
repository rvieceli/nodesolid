import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import {
  UserProxy,
  UsersRepository,
  applyUserProxy,
} from "../repositories/users.repository";

interface GetUserProfileUseCaseResponse {
  user: UserProxy;
}

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async handler(userId: string): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundException("User");
    }

    return { user: applyUserProxy(user) };
  }
}
