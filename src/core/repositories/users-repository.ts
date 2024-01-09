export type CreateInput = {
  id?: string | undefined;
  name: string;
  email: string;
  password_hash: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
};

export interface UsersRepository {
  create(data: CreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
}
