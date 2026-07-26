# Travel Agent

Starter full-stack project with:

- FastAPI backend on port `8000`
- React + TypeScript frontend on port `5173`
- PostgreSQL database on port `5432`

## Run With Docker Compose

```bash
docker compose up --build
```

Open the frontend at http://localhost:5173.

The backend health check is available at http://localhost:8000/health.

## Database

Docker Compose creates a PostgreSQL database with these local development settings:

- Database: `travel_agent`
- User: `travel_agent`
- Password: `travel_agent`
- Host from backend container: `db`
- Host from your machine: `localhost`
- Port: `5432`
