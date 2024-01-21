import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { validateCheckInUseCaseFactory } from "@/core/use-cases/validate-check-in.use-case.factory";

const paramsSchema = z
  .object({
    eventId: z.string().uuid(),
  })
  .strict();

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const { eventId } = paramsSchema.parse(request.params);

  const useCase = validateCheckInUseCaseFactory();

  const { event } = await useCase.handler({
    eventId,
  });

  return reply.status(200).send({ event });
}
