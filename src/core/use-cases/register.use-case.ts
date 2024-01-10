import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";
import { EncryptionService } from "../services/encryption.service";

export interface RegisterUseCaseParams {
  email: string;
  name: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encryptionService: EncryptionService,
  ) {}

  async handler({ email, name, password }: RegisterUseCaseParams) {
    const exists = await this.usersRepository.findByEmail(email);

    if (exists) {
      throw new UserAlreadyExistsException();
    }

    const password_hash = await this.encryptionService.encrypt(password);

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
