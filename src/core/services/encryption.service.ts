export interface EncryptionService {
  encrypt(raw: string): Promise<string>;
  verify(raw: string, encrypted: string): Promise<boolean>;
}
