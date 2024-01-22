import type { FastifyRequest, FastifyReply } from "fastify";
import { getUserMetricsUseCaseFactory } from "@/core/use-cases/get-user-metrics.use-case.factory";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const useCase = getUserMetricsUseCaseFactory();

  const { count } = await useCase.handler({
    userId,
  });

  return reply.status(200).send({ count });
}
