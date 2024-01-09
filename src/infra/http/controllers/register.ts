import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { UsersRepositoryDrizzle } from "@/infra/database/repositories/users-repository.drizzle";
import { RegisterUseCase } from "@/core/use-cases/register.use-case";

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { email, name, password } = registerBodySchema.parse(request.body);

  const usersRepository = new UsersRepositoryDrizzle();
  const registerUseCase = new RegisterUseCase(usersRepository);

  await registerUseCase.handler({
    email,
    name,
    password,
  });

  return reply.status(201).send();
}
