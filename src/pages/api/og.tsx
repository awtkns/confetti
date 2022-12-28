import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import supabase from "../../server/supabase";

export const config = {
  runtime: "experimental-edge",
};

export default async function (req: NextRequest) {
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
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-white text-left">
              <span tw="text-[5rem]">🥳 Estimator</span>
              <span tw="text-yellow-500">
                You have been invited to join a room.
              </span>
            </h2>
            <div tw="mt-8 flex md:mt-0">
              <div tw="flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex rounded-2xl bg-yellow-500 p-4 text-xl font-bold text-white no-underline transition "
                >
                  Join
                </a>
              </div>
              <div tw="ml-3 flex rounded-md shadow">
                <a
                  href="#"
                  tw="flex rounded-2xl bg-white/10 p-4 text-xl font-bold text-white no-underline transition  "
                >
                  Sign in
                </a>
              </div>
            </div>
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
