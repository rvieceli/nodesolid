import { getUserProfileUserCaseFactory } from "@/core/use-cases/get-user-profile.use-case.factory";
import type { FastifyRequest, FastifyReply } from "fastify";

/**
curl http://127.0.0.1:3000/me -o - \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDdlNzI3Mi05ZWViLTQzNzEtYTg1Ni01N2Y2NDZhZmI5MTUiLCJpYXQiOjE3MDU2MDk0NzIsImV4cCI6MTcwNTY5NTg3Mn0.cLERy8rM3PK8d0yALDlV_e1bracCBJX_fkXkQvju0UM"
 */
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const useCase = getUserProfileUserCaseFactory();

  const { user } = await useCase.handler(userId);

  return reply.status(201).send({ user });
}
