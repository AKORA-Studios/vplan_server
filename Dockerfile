FROM denoland/deno:alpine-1.19.2 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

# Install git as dependency
RUN apk fix
RUN apk --no-cache add \
    git=2.30.2-r0 \
    git-lfs=2.13.1-r0 \
    less=563-r0 \
    openssh=8.4_p1-r4 \
    && git lfs install

# Configure git
RUN git config --global user.email "git-history@lernsax.de" \
    && git config --global user.name "Git History Bot" \
    && git config --global pull.ff only

# Modules
COPY ./src/deps.ts ./src/deps.ts
RUN deno cache ./src/deps.ts

# Copy all files -> KEEP .dockerignore UP TO DATE
COPY ./src ./src

COPY ./start.sh ./start.sh
CMD [ "deno", "run", "-A", "/app/src/mod.ts" ]