import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { searchLocationUseCaseFactory } from "@/core/use-cases/search-locations.use-case.factory";
import { paginationSchema } from "../../common/pagination.schema";

const querySchema = paginationSchema.extend({
  q: z.string().trim().min(1),
});

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { page, pageSize, q } = querySchema.parse(request.query);

  const useCase = searchLocationUseCaseFactory();

  const data = await useCase.handler({
    query: q,
    page,
    pageSize,
  });

  return reply.status(200).send(data);
}
