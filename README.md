# Travel Agent

Starter full-stack project with:

- FastAPI backend on local port `8000`
- React + TypeScript frontend on local port `5173` during development
- React + TypeScript frontend built to static files in `frontend/dist` for production
- PostgreSQL database on local host port `5433`

## Configuration

Copy the example env file once:

```bash
cp .env.example .env
```

Docker Compose reads `.env` automatically. The defaults are ready for local
development, so you only need to change `.env` when ports, credentials, or
origins actually differ.

## Local Development

Start the backend and database:

```bash
docker compose up --build
```

The backend health check is available at http://localhost:8000/health.

Start the frontend in another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173.

The frontend always calls `/api`. Locally, Vite proxies `/api/*` to
`http://localhost:8000`. In production, host Caddy proxies `/api/*` to the same
backend port.

## Production Deployment

Docker Compose runs FastAPI and PostgreSQL. The frontend is built separately and
served by the system Caddy installed on the VPS.

```bash
cd frontend
npm ci
npm run build
```

Point host Caddy at `frontend/dist` and proxy `/api/*` to the backend on
`localhost:8000`.

Example Caddy shape:

```caddyfile
travelagent.milenakow.com {
    handle /api/* {
        uri strip_prefix /api
        reverse_proxy 127.0.0.1:8000
    }

    handle {
        root * /opt/travel-agent/frontend/dist
        try_files {path} /index.html
        file_server
    }
}
```

## Database

Docker Compose creates a PostgreSQL database with these local development settings:

- Database: `travel_agent`
- User: `travel_agent`
- Password: `travel_agent`
- Host from backend container: `db`
- Host from your machine: `localhost`
- Port: `5433`
