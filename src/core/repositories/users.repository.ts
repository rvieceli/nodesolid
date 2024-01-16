export type CreateUserInput = {
  id?: string | undefined;
  name: string;
  email: string;
  passwordHash: string;
};

export interface UserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export type UserProxy = UserData & {
  unsafe_getPasswordHash(): string;
};

export function applyUserProxy(user: UserData) {
  const proxy = new Proxy(user, {
    get(target, prop: keyof UserData | "unsafe_getPasswordHash") {
      if (prop === "unsafe_getPasswordHash") {
        return () => target.passwordHash;
      }

      return target[prop];
    },

    getOwnPropertyDescriptor(target, prop: keyof UserData) {
      if (prop === "passwordHash") {
        return undefined;
      }

      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  });

  return proxy as unknown as UserProxy;
}

export interface UsersRepository {
  create(data: CreateUserInput): Promise<UserData>;
  findByEmail(email: string): Promise<UserData | undefined>;
  findById(id: string): Promise<UserData | undefined>;
}
