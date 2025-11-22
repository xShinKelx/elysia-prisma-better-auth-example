# Elysia Prisma Better Auth Example

This is an example project demonstrating how to use Elysia with Prisma.

This example includes:
- Better Auth integration for authentication
- Automatic OpenAPI specification
- Prisma Schema to Input validation via Prismabox
- OpenTelemetry integration via Jaeget (http://localhost:16686)
- Bun Fullstack Dev Server

## Setup
Install the dependencies:

```bash
bun install
```

Setup `.env` based on and example env file

```bash
mv .env.example .env
```

Setup dev environment

```bash
docker compose up -d
```

Migrate the database:

```bash
bun db:migrate
```

## Development
To start the development server run:
```bash
bun dev
```

Open http://localhost:3000 with your browser to see the result.

- http://localhost:3000/openapi for the OpenAPI specification.
- http://localhost:16686 for Jaeger UI.
