import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { App } from 'https://deno.land/x/slack_bolt@1.0.0/mod.ts';

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

await app.start({ port: 3000 });
console.log('🦕 ⚡️');
