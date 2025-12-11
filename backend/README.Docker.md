# Backend Docker

This file explains how to build and run the backend using Docker and how CI handles the image.

Build locally:

```powershell
cd backend
# install deps and build
npm install
npm run build
# build image
docker build -t fright-finds-backend .
# run container (link to db if needed)
docker run -p 3000:3000 --env-file .env fright-finds-backend
```

Run with docker-compose (development with MySQL):

```powershell
# from repo root
docker-compose up --build
```

GitHub Actions

- Workflow `.github/workflows/ci.yml` runs backend tests and builds the image. To push the image to GHCR or DockerHub, configure secrets and uncomment the push steps in the workflow.

