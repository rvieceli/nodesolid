import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerUserCaseFactory } from "@/core/use-cases/register.use-case.factory";

const bodySchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type BodySchema = z.infer<typeof bodySchema>;

/** *
curl http://127.0.0.1:3000/users -o - \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Rafael", "email":"rafael3@example.com","password":"12345678"}'
 */
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { email, name, password } = bodySchema.parse(request.body);

  const registerUseCase = registerUserCaseFactory();

  await registerUseCase.handler({
    email,
    name,
    password,
  });

  return reply.status(201).send();
}
