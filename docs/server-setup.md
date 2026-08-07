# SERVER_SETUP.md

# Server Setup

This document describes how the production VPS was provisioned from a fresh Ubuntu installation.

---

# 1. Update the system

```bash
sudo apt update
sudo apt upgrade -y
sudo reboot
```

---

# 2. Create a non-root user

```bash
adduser milena
usermod -aG sudo milena
```

---

# 3. Configure SSH keys

From the local machine:

```bash
ssh-copy-id milena@SERVER_IP
```

Verify login:

```bash
ssh milena@SERVER_IP
```

---

# 4. Disable root login

```bash
sudo nano /etc/ssh/sshd_config
```

Set:

```text
PermitRootLogin no
```

Restart SSH:

```bash
sudo systemctl restart ssh
```

---

# 5. Disable password authentication

Edit:

```bash
sudo nano /etc/ssh/sshd_config
```

Set:

```text
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
```

Restart SSH:

```bash
sudo systemctl restart ssh
```

---

# 6. Configure firewall

Install UFW:

```bash
sudo apt install ufw
```

Allow required ports:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
```

Enable firewall:

```bash
sudo ufw enable
```

Verify:

```bash
sudo ufw status
```

---

# 7. Install Fail2Ban

```bash
sudo apt install fail2ban
```

Enable service:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

Verify:

```bash
sudo systemctl status fail2ban
```

---

# 8. Install Docker

Install Docker using the official Docker repository.

Verify installation:

```bash
docker --version
docker compose version
```

Allow current user to run Docker:

```bash
sudo usermod -aG docker milena
```

Log out and back in.

Verify:

```bash
docker run hello-world
```

---

# 9. Install Caddy

```bash
sudo apt install caddy
```

Configuration:

```text
/etc/caddy/Caddyfile
```

Verify configuration:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

Reload:

```bash
sudo systemctl reload caddy
```

---

# 10. Clone the project

```bash
sudo mkdir -p /opt
sudo chown $USER:$USER /opt

cd /opt

git clone git@github.com:milenakowalska/travel_agent.git

cd travel-agent
```

---

# 11. Configure application

Create environment file:

```bash
cp .env.example .env
```

Fill production secrets.

---

# 12. Build frontend

```bash
cd frontend

npm ci

npm run build
```

---

# 13. Start backend

```bash
cd ..

docker compose up -d --build
```

---

# 14. Configure Caddy

Example:

```caddy
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

Reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile

sudo systemctl reload caddy
```

---

# 15. Configure GitHub Actions

Repository secrets:

```
VPS_HOST
VPS_USER
VPS_SSH_KEY
```

Workflow:

* SSH into VPS
* `git pull`
* `npm ci`
* `npm run build`
* `docker compose up -d --build`

---

# 16. Verify deployment

Frontend:

```
https://travelagent.milenakow.com
```

API:

```
https://travelagent.milenakow.com/api/health
```

---

# Maintenance

Restart backend:

```bash
cd /opt/travel-agent

docker compose restart backend
```

Restart everything:

```bash
docker compose restart
```

Caddy logs:

```bash
journalctl -u caddy -f
```
