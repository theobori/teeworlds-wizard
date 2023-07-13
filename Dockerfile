FROM node:18 as deps

COPY \
    package.json \
    package-lock.json \
    ./

RUN npm ci

FROM node:18-alpine as builder

COPY package.json tsconfig.json ./
COPY src/ src/
COPY --from=deps /node_modules/ node_modules/

# Splitted into two Docker instructions to cache typescript
RUN \
    npm install typescript -g && \
    npm run build

FROM node:18-alpine as runner

RUN apk add --no-cache shadow

WORKDIR /wizard

RUN \
    addgroup --system --gid 1001 wizard && \
    adduser --system --uid 1001 wizard

USER wizard

COPY .env package.json ./
COPY --from=deps /node_modules/ node_modules/
COPY --from=builder /build ./

CMD [ "npm", "start" ]
