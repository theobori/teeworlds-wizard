# ✂️ teeworlds-wizard

![build](https://github.com/theobori/teeworlds-wizard/actions/workflows/build.yml/badge.svg)

## 📖 Build and run

You only need one of the following requirements:

- [NodeJS](https://nodejs.org/en/download)
  - 18.x
  - 20.x

You need a `.env` file, you can copy `.example.env` and fill the missing values.

### Standalone container

You can use the `Dockerfile` at the project root, but you will need a MongoDB isntance anyway.

### With Docker Compose

The containers need the following environment variables:
- `MONGO_INITDB_ROOT_USERNAME`
- `MONGO_INITDB_ROOT_PASSWORD`

If you want to build it for development, you can run:

```bash
docker compose -f docker-compose.dev.yml up -d
```

For production:

```bash
docker compose build
docker compose up -d
```

## 🤝 Contribute

If you want to help the project, you can follow the guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md).

