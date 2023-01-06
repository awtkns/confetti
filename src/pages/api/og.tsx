import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function (req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(to bottom, #2563eb 0%, #1e293b 100%)",
        }}
      >
        <div tw="flex">
          <div tw="flex py-12 px-4 md:items-center justify-center p-8">
            <h2 tw="flex flex-col text-3xl text-center">
              <span tw="text-[10rem] text-white">🥳 Confetti</span>
              <span tw="text-6xl text-yellow-500 text-center">
                {room
                  ? "CLick to join #" + room + ""
                  : "You have been invited to estimate."}
                .
              </span>
            </h2>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      emoji: "twemoji",
    }
  );
}
