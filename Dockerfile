# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
# Install Dependencies Excluding Dev Dependencies (in package.json)
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
# Copy Dependencies From Stage 1: Dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set Environment Variables (Buildtime)
ARG NEXT_PUBLIC_API
ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}
ARG NEXT_PUBLIC_STUDENT_ID
ENV NEXT_PUBLIC_STUDENT_ID=${NEXT_PUBLIC_STUDENT_ID}

ENV NODE_ENV=production

# Using non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Files From Stage 2: Builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
