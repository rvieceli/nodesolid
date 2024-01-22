import { getUserProfileUserCaseFactory } from "@/core/use-cases/get-user-profile.use-case.factory";
import { SignPayloadType } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.refreshTokenJwtVerify({ onlyCookie: true });

  const { user } = await getUserProfileUserCaseFactory().handler(
    request.user.sub,
  );

  const payload = {
    sub: user.id,
    role: user.role,
  } satisfies SignPayloadType;

  const [token, refreshToken] = await Promise.all([
    reply.jwtSign(payload),
    reply.refreshTokenJwtSign(payload),
  ]);

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .send({
      token,
    });
}
