export const PORT = parseInt(Deno.env.get('PORT') ?? '3000');

export const SLACK_SIGNING_SECRET = Deno.env.get('SLACK_SIGNING_SECRET');
export const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN');
export const SLACK_APP_TOKEN = Deno.env.get('SLACK_APP_TOKEN');

export const FIREBASE_API_KEY = Deno.env.get('FIREBASE_API_KEY');
export const FIREBASE_AUTH_DOMAIN = Deno.env.get('FIREBASE_AUTH_DOMAIN');
export const FIREBASE_PROJECT_ID = Deno.env.get('FIREBASE_PROJECT_ID');
export const FIREBASE_STORAGE_BUCKET = Deno.env.get('FIREBASE_STORAGE_BUCKET');
export const FIREBASE_MESSAGING_SENDER_ID = Deno.env.get(
  'FIREBASE_MESSAGING_SENDER_ID',
);
export const FIREBASE_APP_ID = Deno.env.get('FIREBASE_APP_ID');
