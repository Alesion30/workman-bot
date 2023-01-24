import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { App } from 'https://deno.land/x/slack_bolt@1.0.0/mod.ts';
import { endOfDay, startOfDay } from 'npm:date-fns@2.29.3';
import { userApi } from './api/user.ts';
import {
  PORT,
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
} from './constants/env.ts';
import { LogType } from './types/index.ts';
import {
  errorMessage,
  postKyukeiMessage,
  postSaikaiMessage,
  postSyussyaMessage,
  postTaisyaMessage,
  postTodayRecordMessage,
} from './utils/slack_message.ts';

const app = new App({
  signingSecret: SLACK_SIGNING_SECRET,
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  ignoreSelf: true,
});

app.message(RegExp(/^(today-record).*/), async ({ event, say }) => {
  const uid = (event as any).user as string;
  const now = new Date();

  const api = userApi();

  try {
    const logs = await api.fetchLogs(uid, startOfDay(now), endOfDay(now));
    const message = postTodayRecordMessage(logs);
    await say({ text: message, thread_ts: event.ts } as any);
  } catch {
    const message = errorMessage();
    await say({ text: message, thread_ts: event.ts } as any);
  }
});

// 出社
app.message(
  RegExp(/^(:ronri_syussya:|:syussya:).*/),
  async ({ event, say }) => {
    const type: LogType = 'syussya';
    const uid = (event as any).user as string;
    const now = new Date();

    const api = userApi();

    try {
      await api.postLog(uid, type, now);
      const message = postSyussyaMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    } catch {
      const message = errorMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    }
  },
);

// 退社
app.message(
  RegExp(/^(:ronri_taisya:|:taisya:).*/),
  async ({ event, say }) => {
    const type: LogType = 'taisya';
    const uid = (event as any).user as string;
    const now = new Date();

    const api = userApi();

    try {
      await api.postLog(uid, type, now);
      const logs = await api.fetchLogs(uid, startOfDay(now), endOfDay(now));
      const message = postTaisyaMessage(logs);
      await say({ text: message, thread_ts: event.ts } as any);
    } catch {
      const message = errorMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    }
  },
);

// 休憩
app.message(
  RegExp(/^(:ronri_kyukei:|:kyukei:).*/),
  async ({ event, say }) => {
    const type: LogType = 'kyukei';
    const uid = (event as any).user as string;
    const now = new Date();

    const api = userApi();

    try {
      await api.postLog(uid, type, now);
      const message = postKyukeiMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    } catch {
      const message = errorMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    }
  },
);

// 再開
app.message(
  RegExp(/^(:ronri_saikai:|:saikai:).*/),
  async ({ event, say }) => {
    const type: LogType = 'saikai';
    const uid = (event as any).user as string;
    const now = new Date();

    const api = userApi();

    try {
      await api.postLog(uid, type, now);
      const message = postSaikaiMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    } catch {
      const message = errorMessage();
      await say({ text: message, thread_ts: event.ts } as any);
    }
  },
);

await app.start({ port: PORT });
console.log('🦕 ⚡️');
