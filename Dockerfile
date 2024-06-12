FROM node:18-slim

WORKDIR /wizard

COPY data/ data/
COPY src/ src/
COPY \
    package.json \
    package-lock.json \
    tsconfig.json \
    ./

# Install dependencies and build
RUN npm ci && npm run build

# Remove source files
RUN rm -rf src/

CMD [ "npm", "run", "start" ]
