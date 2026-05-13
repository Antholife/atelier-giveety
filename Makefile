SHELL := /bin/bash

.PHONY: up wait_nextjs_ready sh add-pkg add-pkg-D remove-pkg down restart build-image push-image lint type-check format check

.DEFAULT_GOAL := prevent-default

prevent-default:
	@echo "❌ No default target. Please use 'make <target>' explicitly."
	@exit 1

up: ## Build, install deps, start the dev container and wait for Next.js ready
	@COMPOSE_PROJECT_NAME=front-end docker compose up -d
	@$(MAKE) wait_nextjs_ready

wait_nextjs_ready:
	@printf "\n\033[1;34m🚀 Launching Front-end...\033[0m\n\n"
	@printf "\033[1;33m⏳ Booting Front-end service...\033[0m\n"
	@printf "\033[3m(This may take a little while, especially on first run. Subsequent starts will be faster.)\033[0m\n\n"
	@bash -c 'set -a; [ -f .env ] && source .env; set +a; \
	SECONDS=0; \
	until curl -s "http://localhost:3000" > /dev/null; do \
    	  printf "\r\033[1;36m🔁 Waiting for Front-end ... %ds  \033[0m" $${SECONDS}; \
    	  sleep 1; \
	done; \
	printf "\n\n"'
	@printf "\033[1;31m⚠️  Important: To avoid breaking cross-platform development, only install or remove packages from inside the container.\033[0m\n"
	@printf "\n\033[1;35m🛠️  DEV TOOLS AVAILABLE:\033[0m\n"
	@printf "\033[1;36m - make sh             # Open a shell inside the container\033[0m\n"
	@printf "\033[1;36m - make add-pkg        # Add a production package\033[0m\n"
	@printf "\033[1;36m - make add-pkg-D      # Add a dev package\033[0m\n"
	@printf "\033[1;36m - make remove-pkg     # Remove a package\033[0m\n"
	@printf "\n\033[1;34m📄 Logs are viewable in Docker Desktop or via docker compose logs front-end\033[0m\n"
	@bash -c 'set -a; [ -f .env ] && source .env; set +a; \
	printf "\n\033[1;32m✅  Services are live!\033[0m\n"; \
	printf "\n\033[1;32m👉  Front-end available at: http://localhost:3000\033[0m\n"'

sh: ## Open a shell inside the container
	docker compose exec front-end sh

add-pkg: ## Add a production package inside the container
	@read -p "🔤 Enter the package name: " PKG && \
	if [ -n "$$PKG" ]; then docker compose exec front-end yarn add "$$PKG"; fi

add-pkg-D: ## Add a dev package inside the container
	@read -p "🔤 Enter the dev package name: " PKG && \
	if [ -n "$$PKG" ]; then docker compose exec front-end yarn add -D "$$PKG"; fi

remove-pkg: ## Remove a package inside the container
	@read -p "🔤 Enter the package name to remove: " PKG && \
	if [ -n "$$PKG" ]; then docker compose exec front-end yarn remove "$$PKG"; fi

down:
	docker compose down

restart:
	$(MAKE) down
	$(MAKE) up

# ---------- Quality ----------

lint:
	@yarn lint

type-check:
	@yarn type-check

format:
	@yarn prettier --write .

check: lint type-check

# ---------- DevOps (optional Docker registry) ----------

build-image:
	docker build --platform linux/amd64 --provenance=false -t git.tech-id.org:5050/devops/registry/giveety_attestation/front-end:$(VERSION) -f Dockerfile . --target prod

push-image:
	docker push git.tech-id.org:5050/devops/registry/giveety_attestation/front-end:$(VERSION)
