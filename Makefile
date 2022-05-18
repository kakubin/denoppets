TS=$(shell find -name "*.ts")

all: lint fmt test

lint:
	deno lint --unstable

fmt:
	deno fmt denops

test:
	deno test --unstable --no-run -A ${TS}

.PHONY: lint fmt test all
