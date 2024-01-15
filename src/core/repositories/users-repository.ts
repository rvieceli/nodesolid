export type CreateInput = {
  id?: string | undefined;
  name: string;
  email: string;
  password_hash: string;
};

export interface UserData {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type UserProxy = UserData & {
  unsafe_get_password_hash(): string;
};

export function applyUserProxy(user: UserData) {
  const proxy = new Proxy(user, {
    get(target, prop: keyof UserData | "unsafe_get_password_hash") {
      if (prop === "unsafe_get_password_hash") {
        return () => target.password_hash;
      }

      return target[prop];
    },

    getOwnPropertyDescriptor(target, prop: keyof UserData) {
      if (prop === "password_hash") {
        return undefined;
      }

      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });

  return proxy as unknown as UserProxy;
}

export interface UsersRepository {
  create(data: CreateInput): Promise<UserData>;
  findByEmail(email: string): Promise<UserData | undefined>;
  findById(id: string): Promise<UserData | undefined>;
}
