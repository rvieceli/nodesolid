export type CreateInput = {
  id?: string | undefined;
  name: string;
  email: string;
  password_hash: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type UserProxy = User & {
  unsafe_get_password_hash(): string;
};

export function applyUserProxy(user: User) {
  const proxy = new Proxy(user, {
    get(target, prop: keyof User | "unsafe_get_password_hash") {
      if (prop === "unsafe_get_password_hash") {
        return () => target.password_hash;
      }

      return target[prop];
    },

    getOwnPropertyDescriptor(target, prop: keyof User) {
      if (prop === "password_hash") {
        return undefined;
      }

      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });

  return proxy as unknown as UserProxy;
}

export interface UsersRepository {
  create(data: CreateInput): Promise<UserProxy>;
  findByEmail(email: string): Promise<UserProxy | undefined>;
}
