import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { App } from 'https://deno.land/x/slack_bolt@1.0.0/mod.ts';
import format from 'https://deno.land/x/date_fns@v2.22.1/format/index.js';
import {
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
} from './env.ts';
import { LogType } from './types.ts';
import { fetchLogs, recordLog } from './utils.ts';

const app = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  ignoreSelf: true,
});

const ERROR_MESSAGE = 'エラーが発生しました。。もう一度やり直してください！🙇';

app.message(RegExp(/^(hello).*/), async ({ event }) => {
  const uid = (event as any).user as string;
  const now = new Date();

  const logs = await fetchLogs(uid, now);
  console.log(logs);
});

// 出社
app.message(
  RegExp(/^(:ronri_syussya:|:buturi_syussya:).*/),
  async ({ event, say }) => {
    const type: LogType = 'syussya';
    const uid = (event as any).user as string;
    const now = new Date();
    const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'Asia/Tokyo',
    });

    try {
      const isError = await recordLog(uid, type, now);

      if (isError) {
        await say({ text: 'すでに出社済みです', thread_ts: event.ts } as any);
        return;
      } else {
        await say(
          {
            text: `打刻しました！${nowstr}`,
            thread_ts: event.ts,
          } as any,
        );
      }
    } catch {
      await say({ text: ERROR_MESSAGE, thread_ts: event.ts } as any);
    }
  },
);

// 退社
app.message(
  RegExp(/^(:ronri_taisya:|:buturi_taisya:).*/),
  async ({ event, say }) => {
    const type: LogType = 'taisya';
    const uid = (event as any).user as string;
    const now = new Date();
    const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'Asia/Tokyo',
    });

    try {
      const isError = await recordLog(uid, type, now);

      if (isError) {
        await say({ text: 'すでに退社済みです', thread_ts: event.ts } as any);
        return;
      } else {
        await say(
          {
            text: `お疲れ様でした！${nowstr}`,
            thread_ts: event.ts,
          } as any,
        );
      }
    } catch {
      await say({ text: ERROR_MESSAGE, thread_ts: event.ts } as any);
    }
  },
);

// 休憩
app.message(
  RegExp(/^(:ronri_kyukei:|:buturi_kyukei:).*/),
  async ({ event, say }) => {
    const type: LogType = 'kyukei';
    const uid = (event as any).user as string;
    const now = new Date();
    const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'Asia/Tokyo',
    });

    try {
      const isError = await recordLog(uid, type, now);

      if (isError) {
        await say({ text: 'すでに休憩済みです', thread_ts: event.ts } as any);
        return;
      } else {
        await say(
          {
            text: `ゆっくり休みましょう！${nowstr}`,
            thread_ts: event.ts,
          } as any,
        );
      }
    } catch {
      await say({ text: ERROR_MESSAGE, thread_ts: event.ts } as any);
    }
  },
);

// 再開
app.message(
  RegExp(/^(:ronri_saikai:|:buturi_saikai:).*/),
  async ({ event, say }) => {
    const type: LogType = 'saikai';
    const uid = (event as any).user as string;
    const now = new Date();
    const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'Asia/Tokyo',
    });

    try {
      const isError = await recordLog(uid, type, now);

      if (isError) {
        await say({ text: 'すでに再開済みです', thread_ts: event.ts } as any);
        return;
      } else {
        await say(
          {
            text: `引き続きがんばりましょう！${nowstr}`,
            thread_ts: event.ts,
          } as any,
        );
      }
    } catch {
      await say({ text: ERROR_MESSAGE, thread_ts: event.ts } as any);
    }
  },
);

await app.start({ port: 3000 });
console.log('🦕 ⚡️');
