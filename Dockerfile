#syntax=docker/dockerfile:1

# Versions
FROM node:24.10.0-slim AS node_upstream

# Base stage for dev and build
FROM node_upstream AS base

WORKDIR /srv/app

RUN npm install -g corepack@latest && \
  corepack enable && \
  corepack prepare yarn@stable --activate && \
  yarn set version stable


# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Delete the following line in case you want to enable telemetry during dev and build.
ENV NEXT_TELEMETRY_DISABLED=1

# Common stage for dev and CI
FROM base AS dev_common

# Copy source code and install dependencies
# Note: In docker-compose, this is OVERRIDDEN with volume mounts for live reload
COPY --link . ./

# Install deps during build for CI/CD (no volume mounts in CI)
RUN yarn install && yarn cache clean

# Development image - for docker-compose local dev
FROM dev_common AS development

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=localhost

# Note: yarn.lock MUST be generated at runtime in Linux container (AMD64) for cross-platform compatibility
# When volume is mounted, yarn.lock generated in container will sync to host
# Dependencies will be installed via CMD after volume mount

CMD ["sh", "-c", "\
  echo '📦 Installing dependencies...'; \
  echo ''; \
  yarn install; \
  echo ''; \
  echo '🚀 Starting Next.js server (Front-end)...'; \
  echo ''; \
  yarn dev"]

FROM base AS builder

# Disable static generation completely
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_BUILD_STATIC_GENERATION=true
ENV CI=true
# Enable Next.js `output: "standalone"` so the prod image stays minimal.
ENV BUILD_STANDALONE=true

# Copy only production-necessary files for build (exclude tests, tools, docs)
# Note: .yarn/install-state.gz and next-env.d.ts are gitignored (generated files)
COPY --link package.json yarn.lock .yarnrc.yml ./
COPY --link .yarn/patches ./.yarn/patches
COPY --link next.config.ts tsconfig.json ./
COPY --link public public/
COPY --link src src/

RUN yarn install && yarn cache clean

RUN yarn build

# Production image - matches Makefile target 'prod'
FROM node_upstream AS prod

WORKDIR /srv/app

ENV NODE_ENV=production
# Delete the following line in case you want to enable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Create user and setup directories
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs && \
  mkdir .next && \
  chown nextjs:nodejs .next

COPY --from=builder --link /srv/app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/standalone ./
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
