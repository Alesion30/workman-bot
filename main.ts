import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { App } from 'https://deno.land/x/slack_bolt@1.0.0/mod.ts';
import format from 'https://deno.land/x/date_fns@v2.22.1/format/index.js';
import {
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
} from './env.ts';
import { LogType } from './types.ts';
import { calculate, fetchLogs, recordLog } from './utils.ts';

const app = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  ignoreSelf: true,
});

const ERROR_MESSAGE = 'エラーが発生しました:gopher-bom:';

app.message(RegExp(/^(workman-time).*/), async ({ event, say }) => {
  const uid = (event as any).user as string;
  const now = new Date();
  const nowstr = format(now, 'yyyy-MM-dd', {
    timeZone: 'Asia/Tokyo',
  });

  const logs = await fetchLogs(uid, now);
  const time = calculate(logs);

  if (time.work > 0) {
    await say(
      `${nowstr}の勤怠です:awesome-gopher:\n- 稼働時間: ${time.work}[s]\n- 休憩時間: ${time.rest}[s]`,
    );
  } else {
    await say(`${nowstr}の勤怠はありません:gopher-bom:`);
  }
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
      await recordLog(uid, type, now);
      await say(
        {
          text: `打刻しました！${nowstr}`,
          thread_ts: event.ts,
        } as any,
      );
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
      await recordLog(uid, type, now);
      await say(
        {
          text: `お疲れ様でした！${nowstr}`,
          thread_ts: event.ts,
        } as any,
      );
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
      await recordLog(uid, type, now);
      await say(
        {
          text: `ちゃんと休みましょう！${nowstr}`,
          thread_ts: event.ts,
        } as any,
      );
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
      await recordLog(uid, type, now);
      await say(
        {
          text: `引き続きがんばりましょう！${nowstr}`,
          thread_ts: event.ts,
        } as any,
      );
    } catch {
      await say({ text: ERROR_MESSAGE, thread_ts: event.ts } as any);
    }
  },
);

await app.start({ port: 3000 });
console.log('🦕 ⚡️');
