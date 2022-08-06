# workman bot

勤怠記録slack bot

### heroku設定

```sh
# TZ変更
heroku config:add TZ=Asia/Tokyo

# buildpack
heroku buildpacks:set https://github.com/chibat/heroku-buildpack-deno.git

# 環境変数セット
heroku config:set SLACK_APP_TOKEN=
heroku config:set SLACK_BOT_TOKEN=
heroku config:set SLACK_SIGNING_SECRET=
heroku config:set FIREBASE_API_KEY=
heroku config:set FIREBASE_AUTH_DOMAIN=
heroku config:set FIREBASE_PROJECT_ID=
heroku config:set FIREBASE_STORAGE_BUCKET=
heroku config:set FIREBASE_MESSAGING_SENDER_ID=
heroku config:set FIREBASE_APP_ID=
```
