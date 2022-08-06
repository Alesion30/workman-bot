.PHONY: run
run:
	deno run --allow-env --allow-read --allow-net main.ts

.PHONY: fmt
fmt:
	deno fmt -c deno.json

.PHONY: lint
lint:
	deno lint -c deno.json

.PHONY: set-buildpack
set-buildpack:
	heroku buildpacks:set https://github.com/chibat/heroku-buildpack-deno.git
