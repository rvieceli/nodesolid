import { EncryptionService } from "@/core/services/encryption.service";
import { hash, compare } from "bcrypt";

export class BcryptService implements EncryptionService {
  async encrypt(raw: string) {
    return hash(raw, 8);
  }

  async verify(raw: string, encrypted: string) {
    return compare(raw, encrypted);
  }
}
