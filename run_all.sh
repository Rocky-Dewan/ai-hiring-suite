#!/bin/bash
set -e

echo "======================================"
echo "1️⃣  Building Docker containers..."
docker-compose build

echo "======================================"
echo "2️⃣  Starting containers..."
docker-compose up -d

echo "======================================"
echo "3️⃣  Waiting for backend to be ready (10s)..."
sleep 10

echo "======================================"
echo "4️⃣  Seeding jobs from Airtable..."
docker exec -it ai-hiring-backend npm run ts-node scripts/seed_jobs.ts

echo "======================================"
echo "5️⃣  Running health checks..."

# Backend health
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health)
if [ "$BACKEND_STATUS" -eq 200 ]; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
fi

# Frontend check
if curl -s --head http://localhost:5173 | grep "200 OK" > /dev/null; then
  echo "✅ Frontend is running"
else
  echo "❌ Frontend is not reachable"
fi

echo "======================================"
echo "6️⃣  Logs summary (last 5 lines of backend logs)..."
docker logs --tail 5 ai-hiring-backend

echo "======================================"
echo "🎉 AI Hiring Suite is ready!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:4000/api"
echo "Database: PostgreSQL on localhost:5432 (user: postgres, db: ai_hiring)"
