SHELL := /bin/bash

# Giveety Design Kit (Next.js) — local Docker dev + CI image helpers
DOCKER_REGISTRY ?= git.tech-id.org:5050/devops/registry/giveety_V2/design_kit_anthony_chahat
VERSION ?= $(shell node -p "require('./package.json').version" 2>/dev/null || echo latest)

COMPOSE_SERVICE := giveety-design-kit

.PHONY: prevent-default up wait_nextjs_ready sh down restart \
	build-image push-image deploy lint type-check format check

.DEFAULT_GOAL := prevent-default

prevent-default:
	@echo "❌ Pas de cible par défaut. Utilise : make \033[1m<target>\033[0m (ex. make up)."
	@exit 1

up: ## Compose build, deps, démarrage du conteneur dev + attente Next.js
	docker compose up -d
	@$(MAKE) wait_nextjs_ready

wait_nextjs_ready:
	@printf "\n\033[1;34m🚀 Démarrage Giveety Design Kit (Next.js)…\033[0m\n\n"
	@printf "\033[1;33m⏳ Attente du service local…\033[0m\n"
	@printf "\033[3m(Plus long au premier lancement ; les suivants sont plus rapides.)\033[0m\n\n"
	@bash -c 'set -a; [ -f .env ] && source .env; set +a; \
	PORT="$${NEXT_PORT:-3000}"; \
	SECONDS=0; \
	until curl -s "http://localhost:$${PORT}" > /dev/null; do \
	  printf "\r\033[1;36m🔁 En attente sur http://localhost:%s … %ds  \033[0m" "$${PORT}" "$${SECONDS}"; \
	  sleep 1; \
	done; \
	printf "\n\n"'
	@printf "\n\033[1;35m🛠️  Commandes utiles :\033[0m\n"
	@printf "\033[1;36m - make sh             # Shell dans le conteneur\033[0m\n"
	@printf "\033[1;36m - make down           # Arrêt des services\033[0m\n"
	@printf "\033[1;36m - make check          # lint + type-check\033[0m\n"
	@bash -c 'set -a; [ -f .env ] && source .env; set +a; \
	PORT="$${NEXT_PORT:-3000}"; \
	printf "\n\033[1;34m📄 Logs : Docker Desktop ou \`docker compose logs -f $(COMPOSE_SERVICE)\`\033[0m\n"; \
	printf "\n\033[1;32m✅  Prêt — http://localhost:%s\033[0m\n" "$${PORT}"'

sh: ## Shell interactif dans le conteneur dev
	docker compose exec $(COMPOSE_SERVICE) sh

down:
	docker compose down

restart:
	$(MAKE) down
	$(MAKE) up

# ---------- Qualité ----------

lint:
	@yarn lint

type-check:
	@yarn type-check

format:
	@yarn prettier --write .

check: lint type-check

# ---------- Image prod (registry interne) ----------

build-image: ## Image prod (VERSION par défaut = version package.json)
	docker build --platform linux/amd64 --provenance=false \
		-t $(DOCKER_REGISTRY):$(VERSION) -f Dockerfile . --target prod

push-image:
	docker push $(DOCKER_REGISTRY):$(VERSION)

deploy: build-image ## Build + push (${DOCKER_REGISTRY}:$(VERSION))
	$(MAKE) push-image
