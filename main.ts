import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { App } from 'https://deno.land/x/slack_bolt@1.0.0/mod.ts';
import { datetime } from 'https://deno.land/x/ptera@v1.0.2/mod.ts';

const app = new App({
  signingSecret: Deno.env.get('SLACK_SIGNING_SECRET'),
  token: Deno.env.get('SLACK_BOT_TOKEN'),
  appToken: Deno.env.get('SLACK_APP_TOKEN'),
  socketMode: true,
  ignoreSelf: true,
});

app.event('message', async ({ event, say }) => {
  console.log(event);
  await say('pong');
});

// 出社
app.message(
  RegExp(/^(:ronri_syussya:|:buturi_syussya:).*/),
  async ({ event, say }) => {
    console.log(event);
    const now = datetime().toISO();
    // deno-lint-ignore no-explicit-any
    await say({ text: `打刻しました！${now}`, thread_ts: event.ts } as any);
  },
);

await app.start({ port: 3000 });
console.log('🦕 ⚡️');
