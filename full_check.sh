#!/bin/bash
set -e

echo "======================================"
echo "1️⃣  Building Docker containers..."
docker-compose build

echo "======================================"
echo "2️⃣  Starting containers..."
docker-compose up -d

echo "======================================"
echo "3️⃣  Waiting for backend to initialize (15s)..."
sleep 15

echo "======================================"
echo "4️⃣  Seeding jobs from Airtable..."
docker exec -it ai-hiring-backend npm run ts-node scripts/seed_jobs.ts

echo "======================================"
echo "5️⃣  Backend health check..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health)
if [ "$BACKEND_STATUS" -eq 200 ]; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
fi

echo "======================================"
echo "6️⃣  Frontend check..."
if curl -s --head http://localhost:5173 | grep "200 OK" > /dev/null; then
  echo "✅ Frontend is running"
else
  echo "❌ Frontend is not reachable"
fi

echo "======================================"
echo "7️⃣  Test AI Chains (extractProfile, questionGen, evalRubric)..."
docker exec -it ai-hiring-backend node -e "
const { extractProfile } = require('./src/ai/chains/extractProfile');
const { questionGen } = require('./src/ai/chains/questionGen');
const { evalRubric } = require('./src/ai/chains/evalRubric');

(async () => {
  const profile = await extractProfile('John Doe, software engineer');
  console.log('Profile:', profile);
  const questions = await questionGen(profile);
  console.log('Questions:', questions);
  const score = await evalRubric(questions, profile);
  console.log('Eval Score:', score);
})();
"

echo "======================================"
echo "8️⃣  Test Resume Upload endpoint..."
curl -X POST http://localhost:4000/api/applicants \
  -F "file=@./scripts/test_resume.pdf" \
  -F "jobId=example-job-id" \
  -F "candidateEmail=test@example.com" | jq

echo "======================================"
echo "9️⃣  Test Video + Audio Upload + STT..."
curl -X POST http://localhost:4000/api/interview/upload \
  -F "video=@./scripts/test_video.mp4" \
  -F "audio=@./scripts/test_audio.mp3" \
  -F "candidateId=example-candidate-id" | jq

echo "======================================"
echo "🔟 Test Calendar & Email Scheduling..."
docker exec -it ai-hiring-backend node -e "
const { createCalendarEvent } = require('./src/services/calendarMailer');
(async () => {
  await createCalendarEvent({
    candidateEmail: 'test@example.com',
    recruiterEmail: 'hr@example.com',
    start: new Date(Date.now() + 3600000),
    end: new Date(Date.now() + 7200000),
    subject: 'Test Interview Event',
    description: 'This is a test interview.'
  });
  console.log('✅ Calendar & Email test completed');
})();
"

echo "======================================"
echo "11️⃣  Backend logs summary (last 10 lines)..."
docker logs --tail 10 ai-hiring-backend

echo "======================================"
echo "🎉 Full AI Hiring Suite verification complete!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:4000/api"
echo "Database: PostgreSQL on localhost:5432"
