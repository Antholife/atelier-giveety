SHELL  := /bin/bash
PYTHON := $(shell command -v python3 || command -v python)

.PHONY: up wait_nextjs_ready sh-front-end add-pkg-front-end add-pkg-D-front-end remove-pkg-front-end test-front-end down restart build-front-end push-front-end build-all push-all versioning building check deploy nx-projects nx-affected nx-graph nx-format nx-lint nx-type-check nx-test nx-reset

.DEFAULT_GOAL := prevent-default

PYTHON_SCRIPT := $(PYTHON) scripts/test.py

prevent-default:
	@echo "❌ No default target. Please use 'make <target>' explicitly."
	@exit 1

up: ## Build, install deps, start all services in detached mode, and wait for Next.js ready
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
	@printf "\033[1;36m - make sh-front-end       # Open a shell inside the front-end container\033[0m\n"
	@printf "\033[1;36m - make add-pkg-front-end       # Add production packages\033[0m\n"
	@printf "\033[1;36m - make add-pkg-D-front-end # Add dev-only packages\033[0m\n"
	@printf "\033[1;36m - make remove-pkg-front-end # Remove packages\033[0m\n"
	@printf "\033[1;36m - make test-front-end # Run tests in the container\033[0m\n"
	@printf "\n\033[1;33m💡 Tip: All commands above can also be run manually inside the container:\033[0m\n"
	@printf "\033[1;36m    make sh-front-end\033[0m\n"
	@printf "\n\033[1;34m📄 Logs are viewable in Docker Desktop or via make logs-front-end\033[0m\n"
	@bash -c 'set -a; [ -f .env ] && source .env; set +a; \
	printf "\n\033[1;32m✅  Services are live!\033[0m\n"; \
	printf "\n\033[1;32m👉  Front-end available at: http://localhost:3000\033[0m\n"'

sh-front-end: ## Open a shell inside the front-end container
	docker compose exec front-end sh

# Dev helpers
add-pkg-front-end: ## Add a production package to the front-end container
	@read -p "🔤 Enter the package name: " PKG && \
	if [ -n "$$PKG" ]; then docker compose exec front-end yarn add "$$PKG"; fi

add-pkg-D-front-end: ## Add a dev package to the front-end container
	@read -p "🔤 Enter the dev package name: " PKG && \
	if [ -n "$$PKG" ]; then docker compose exec front-end yarn add -D "$$PKG"; fi

remove-pkg-front-end: ## Remove a package from the front-end container
	@read -p "🔤 Enter the package name to remove: " PKG && \
	if [ -n "$$PKG" ]; then docker compose exec front-end yarn remove "$$PKG"; fi

test-front-end: ## Run tests in the front-end container
	docker compose exec front-end yarn test:container

down:
	docker compose down

restart:
	$(MAKE) down
	$(MAKE) up

# ---------- DevOps COMMANDS ----------

build-front-end:
	docker build --platform linux/amd64 --provenance=false -t git.tech-id.org:5050/devops/registry/giveety_attestation/front-end:$(VERSION) -f apps/front-end/Dockerfile . --target prod

push-front-end:
	docker push git.tech-id.org:5050/devops/registry/giveety_attestation/front-end:$(VERSION)

build-all:
	$(MAKE) build-front-end VERSION=$(VERSION_FRONT_END)

push-all:
	$(MAKE) push-front-end VERSION=$(VERSION_FRONT_END)

# WARNING: This target bypasses the NX system and should ONLY be used
# if there are deployment issues or NX blocks your process!
push-image-manually:
	@$(PYTHON) scripts/build.py push_image_to_registry

versioning:
	@printf "\n\033[1;34m🔍 Running NX deployment...\033[0m\n\n"
	@$(PYTHON) scripts/nx.py || (printf "\033[1;31m⛔  NX Deployment failed or was skipped.\033[0m\n\n" && exit 1)

building:
	@printf "\n\033[1;36m🧱 Building ...\033[0m\n\n"
	@$(PYTHON) scripts/build.py || (printf "\n\033[1;31m❌  Docker Build failed. Aborting.\033[0m\n\n" && exit 1)

check-front-end:
	@make nx-lint
	@make nx-type-check
	@make nx-format
    ## @make nx-test

deploy: check-front-end versioning building nx-reset

# --- Frontend Test Suites ---

test-architecture-frontend: ## Validate frontend hexagonal architecture (CustomValidator + dependency-cruiser)
	@echo "🏗️  Validating frontend architecture..."
	@echo ""
	@echo "📋 Step 1/2: Validating directory structure and test coverage (CustomValidator)..."
	@docker compose exec -T front-end node tests/architecture/CustomValidator.mjs || (echo "" && echo "❌ CustomValidator failed. Fix issues above before running dependency-cruiser." && exit 1)
	@echo ""
	@echo "🔍 Step 2/2: Validating dependencies between layers (dependency-cruiser)..."
	@docker compose exec -T front-end yarn depcruise --config tests/architecture/utils/dependency-cruiser.config.js src || (echo "" && echo "❌ Dependency-cruiser failed. Fix import violations above." && exit 1)
	@echo ""
	@echo "✅ All frontend architecture validations passed!"

test-frontend-unit: ## Run frontend unit tests (Vitest)
	@$(PYTHON_SCRIPT) --type=frontend --tool=unit

test-frontend-functional: ## Run frontend functional tests (Vitest)
	@$(PYTHON_SCRIPT) --type=frontend --tool=functional

# ---------- NX COMMANDS ----------

nx-projects:
	@printf "\n🔍 Listing all Nx projects...\n\n"
	@npx nx show projects

nx-affected:
	@echo "🔍 Showing affected projects (HEAD~1 → HEAD)..."
	@npx nx show projects --affected --base=HEAD~1 --head=HEAD

nx-graph:
	@echo "📈 Opening the Nx project graph..."
	@npx nx graph

nx-format:
	@printf "\033[1;34m🧹 Formatting code...\033[0m\n"
	@npx nx format:write || (printf "\n❌  Formatting failed. Please fix the issues and try again.\n" && exit 1)
	@printf "\n\033[1;32m✅  Nx format completed successfully.\033[0m\n\n"

nx-lint:
	@printf "\n\033[1;34m🔎 Running lint on the workspace...\033[0m\n"
	@npx nx run front-end:lint || (printf "\n❌  Linting failed. Please fix the issues and try again.\n" && exit 1)

nx-type-check:
	@printf "\033[1;34m🔍 Checking TypeScript types...\033[0m\n"
	@npx nx run front-end:type-check || (printf "\n❌  Type check failed. Please fix the issues and try again.\n" && exit 1)
	@printf "\n\033[1;32m✅  Type check completed successfully.\033[0m\n\n"

nx-test:
	@printf "\033[1;34m🧪 Running tests on the workspace...\033[0m\n"
	@npx nx run front-end:test || (printf "\n❌  Tests failed. Please fix the issues and try again.\n" && exit 1)
	@printf "\n\033[1;32m✅  Tests completed successfully.\033[0m\n\n"

nx-reset:
	@printf "\033[1;34m🧼 Clearing Nx cache...\033[0m\n"
	@npx nx reset