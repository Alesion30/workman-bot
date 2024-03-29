.PHONY: run
run:
	deno run --allow-env --allow-read --allow-net src/main.ts

.PHONY: fmt
fmt:
	deno fmt -c deno.json

.PHONY: lint
lint:
	deno lint -c deno.json

.PHONY: heroku-scale
heroku-scale:
	heroku ps:scale websocket=1

.PHONY: set-buildpack
set-buildpack:
	heroku buildpacks:set https://github.com/chibat/heroku-buildpack-deno.git
