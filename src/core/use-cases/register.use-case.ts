import { hash } from "bcrypt";
import { UsersRepository } from "../repositories/users-repository";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";

export interface RegisterUseCaseParams {
  email: string;
  name: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async handler({ email, name, password }: RegisterUseCaseParams) {
    const password_hash = await hash(password, 8);

    const exists = await this.usersRepository.findByEmail(email);

    if (exists) {
      throw new UserAlreadyExistsException();
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
