import type { RealtimeChannel } from "@supabase/realtime-js";

import { env } from "../env/client.mjs";
import {RealtimeClient} from "@supabase/realtime-js";


const realtimeClient = new RealtimeClient(env.NEXT_PUBLIC_SUPABASE_URL, {
    params: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        eventsPerSecond: 10,
    },
})

export const subscribe = (channelId: string): RealtimeChannel =>
  realtimeClient.channel(channelId, {
    config: {
      broadcast: { self: false, ack: true },
      presence: { key: channelId },
    },
  });

export const unsubscribeCallback =
  (channel: RealtimeChannel | undefined) => () => {
    channel?.unsubscribe();
  };
