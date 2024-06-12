# ♥️ teeworlds-wizard

![build](https://github.com/Teeskins/teedata-discord-bot/actions/workflows/build.yml/badge.svg)

## 📖 Build and run

You only need one of the following requirements:

- [NodeJS](https://nodejs.org/en/download)
  - 18.x
  - 20.x

### Environment variables

This is a description of the needed environment variable for the application at runtime, at least, for the "initialization" step.

| Name | Description | Mandatory |
| -- | -- | -- |
| TOKEN | Discord Bot token | Yes |
| MONGO_URI | MongoDB URI connection (see the Docker Compose file for example) | Yes |
| MONGO_INITDB_ROOT_USERNAME | MongoDB root username | Yes |
| MONGO_INITDB_ROOT_PASSWORD | MongoDB root password | Yes |
| MONGO_DATABASE | MongoDB database name | No |
| LOG_DIR | Application logs directory | No |

### Standalone container

You can use the `Dockerfile` at the project root, but you will need a MongoDB isntance anyway.
The container will need the above environment variables.

### With Docker Compose

The production Docker Compose file uses a `.env` file, you can create one with the above environment variables.

The Docker Compose file need the following environment variables:
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
