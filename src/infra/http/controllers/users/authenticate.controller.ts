import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { authenticateUserCaseFactory } from "@/core/use-cases/authenticate.use-case.factory";

const bodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type BodySchema = z.infer<typeof bodySchema>;

/**
curl http://127.0.0.1:3000/sessions -o - \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"rafael3@example.com","password":"12345678"}'
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDdlNzI3Mi05ZWViLTQzNzEtYTg1Ni01N2Y2NDZhZmI5MTUiLCJpYXQiOjE3MDU2MDk0NzIsImV4cCI6MTcwNTY5NTg3Mn0.cLERy8rM3PK8d0yALDlV_e1bracCBJX_fkXkQvju0UM
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = bodySchema.parse(request.body);

  const authenticateUseCase = authenticateUserCaseFactory();

  const { user } = await authenticateUseCase.handler({
    email,
    password,
  });

  const [token, refreshToken] = await Promise.all([
    reply.jwtSign({ sub: user.id }),
    reply.refreshTokenJwtSign({ sub: user.id }),
  ]);

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(201)
    .send({
      token,
    });
}
