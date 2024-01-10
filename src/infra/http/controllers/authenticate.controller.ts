import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { authenticateUserCaseFactory } from "@/core/use-cases/authenticate.use-case.factory";

const authenticateBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

/**
curl http://127.0.0.1:3000/sessions -o - \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"rafael3@example.com","password":"12345678"}'
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  const authenticateUseCase = authenticateUserCaseFactory();

  await authenticateUseCase.handler({
    email,
    password,
  });

  return reply.status(201).send();
}
