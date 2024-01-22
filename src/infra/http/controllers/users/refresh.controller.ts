import { getUserProfileUserCaseFactory } from "@/core/use-cases/get-user-profile.use-case.factory";
import { FastifyReply, FastifyRequest } from "fastify";

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.refreshTokenJwtVerify({ onlyCookie: true });

  const { user } = await getUserProfileUserCaseFactory().handler(
    request.user.sub,
  );

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
    .status(200)
    .send({
      token,
    });
}
