import type { FastifyRequest, FastifyReply } from "fastify";
import { fetchUserEventsHistoryUseCaseFactory } from "@/core/use-cases/fetch-user-events-history.use-case.factory";
import { paginationSchema } from "../../common/pagination.schema";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { page, pageSize } = paginationSchema.parse(request.query);
  const useCase = fetchUserEventsHistoryUseCaseFactory();

  const data = await useCase.handler({
    userId,
    page,
    pageSize,
  });

  return reply.status(200).send(data);
}
