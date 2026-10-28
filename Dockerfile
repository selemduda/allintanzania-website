# Production image for the All in Tanzania website (Next.js + Payload CMS).
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Full source and dependencies. Also used to run one-off tasks such as `npm run seed`.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Pages render on request, so the build does not need the database.
ENV PAYLOAD_SECRET=build-only DATABASE_URL=postgres://build:build@localhost:5432/build
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Uploaded photos and price lists when DigitalOcean Spaces is not configured
RUN mkdir -p media private/price-lists && chown -R nextjs:nodejs media private
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
