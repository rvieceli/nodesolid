import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { createLocationUseCaseFactory } from "@/core/use-cases/create-location.use-case.factory";

const bodySchema = z
  .object({
    name: z.string(),
    address: z.string(),
    description: z.string().optional().nullable(),
    phone: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

export type BodySchema = z.infer<typeof bodySchema>;

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { address, latitude, longitude, name, phone, description } =
    bodySchema.parse(request.body);

  const useCase = createLocationUseCaseFactory();

  const { location } = await useCase.handler({
    name,
    address,
    description,
    phone,
    coordinates: {
      lat: latitude,
      lng: longitude,
    },
  });

  return reply.status(201).send({ location });
}
