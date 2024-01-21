import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { checkInUseCaseFactory } from "@/core/use-cases/check-in.use-case.factory";

const bodySchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

const paramsSchema = z
  .object({
    locationId: z.string().uuid(),
  })
  .strict();

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { latitude, longitude } = bodySchema.parse(request.body);
  const { locationId } = paramsSchema.parse(request.params);

  const useCase = checkInUseCaseFactory();

  const { event } = await useCase.handler({
    userId,
    locationId,
    userCoordinates: {
      lat: latitude,
      lng: longitude,
    },
  });

  return reply.status(201).send({ event });
}
