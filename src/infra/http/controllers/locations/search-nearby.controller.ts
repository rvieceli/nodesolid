import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { searchNearbyLocationUseCaseFactory } from "@/core/use-cases/search-nearby-locations.use-case.factory";
import { paginationSchema } from "../../common/pagination.schema";

const querySchema = paginationSchema.extend({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export async function searchNearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, pageSize, latitude, longitude } = querySchema.parse(
    request.query,
  );

  const useCase = searchNearbyLocationUseCaseFactory();

  const data = await useCase.handler({
    coordinates: {
      lat: latitude,
      lng: longitude,
    },
    page,
    pageSize,
  });

  return reply.status(200).send(data);
}
