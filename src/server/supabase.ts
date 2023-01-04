import type { RealtimeChannel } from "@supabase/realtime-js";
import { createClient } from "@supabase/supabase-js";

import { env } from "../env/client.mjs";

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export const subscribe = (channelId: string): RealtimeChannel =>
  supabase.channel(channelId, {
    config: {
      broadcast: { self: false, ack: true },
      presence: { key: channelId },
    },
  });

export const unsubscribeCallback =
  (channel: RealtimeChannel | undefined) => () => {
    channel?.unsubscribe().then();
  };
