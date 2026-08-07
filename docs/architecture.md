# VPS Architecture

## Overview

Stack:

* **Ubuntu 26.04**
* **Caddy** (reverse proxy + automatic HTTPS)
* **Docker Compose**
* **FastAPI** backend
* **PostgreSQL**
* **React + Vite** frontend (built as static files)

Project location:

```text
/opt/travel-agent
```

---

# Architecture

```text
                     Internet
                        │
                        ▼
            https://travelagent.milenakow.com
                        │
                        ▼
                      Caddy
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
  frontend/dist              FastAPI backend
 (static files)              Docker container
                                      │
                                      ▼
                               PostgreSQL
                             Docker container
```

---

# Components

## Caddy

Installed directly on the VPS.

Responsibilities:

* serves the React frontend
* proxies `/api/*` requests to the backend
* automatically provisions and renews HTTPS certificates

Configuration:

```text
/etc/caddy/Caddyfile
```

Reload after changes:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

---

## Frontend

Location:

```text
/opt/travel-agent/frontend
```

Production build:

```bash
npm ci
npm run build
```

Output:

```text
frontend/dist
```

Caddy serves this directory directly.

No Vite dev server runs in production.

---

## Backend

Runs inside Docker.

Exposed only on localhost:

```text
127.0.0.1:8000
```

Caddy forwards `/api/*` requests to the backend.

---

## Database

PostgreSQL runs in Docker.

Persistent data is stored in a Docker volume:

```text
postgres_data
```

The backend connects to the database through the Docker network.

---

# Deployment

Automatic deployments are triggered by GitHub Actions after every push to `main`.

Deployment steps:

1. SSH into VPS
2. `git pull`
3. Build frontend
4. Rebuild Docker containers
5. Remove unused Docker images

Equivalent manual deployment:

```bash
cd /opt/travel-agent

git pull

cd frontend
npm ci
npm run build

cd ..

docker compose up -d --build
```
