import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import {
  UserProxy,
  UsersRepository,
  applyUserProxy,
} from "../repositories/users.repository";
import { EncryptionService } from "../services/encryption.service";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: UserProxy;
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encryptionService: EncryptionService,
  ) {}

  async handler({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const doesPasswordMatch = await this.encryptionService.verify(
      password,
      user.password_hash,
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsException();
    }

    return { user: applyUserProxy(user) };
  }
}
