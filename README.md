# ai-hiring-suite

This AI Hiring Suite is basically a full-stack, AI-driven, end-to-end recruitment automation platform with real-time interview capability, calendar scheduling, assessments, fairness checks, and a proper modern dev stack.

## Folder Structure

    - apps/web: Frontend (React, Tailwind, Vite)
    - apps/api: Backend (Node, Express, TypeScript)
    - packages/shared: Shared types
    - scripts: Seed jobs
    - postman: API requests
    - infra: Infrastructure



## Quick start

1. Clone repository:

    git clone <repo-url>
    cd ai-hiring-suite


2. Install dependencies:

    npm install
    cd apps/web && npm install
    cd ../api && npm install


3. Setup environment:

    Copy .env.example → .env

    Fill in OpenAI, Cohere, Airtable, SMTP, Supabase keys.

4. Run locally (frontend + backend):
    npm run dev


5. Seed Jobs:
    cd scripts
    npm run ts-node seed_jobs.ts

6. Docker 
    docker-compose up --build


7.Features

    Resume parsing & candidate profile extraction

    AI-generated interview questions & evaluation

    Video/audio interview recording + STT transcription

    Calendar scheduling & email notifications

    Vector search & reranking for job matching

    Admin dashboard & analytics

8. Environment Variables

    OPENAI_API_KEY

    COHERE_API_KEY

    AIRTABLE_API_KEY

    AIRTABLE_BASE_ID

    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

    SUPABASE_URL, SUPABASE_KEY

    DATABASE_URL

9. Verification Steps

    Run ./run_all.sh to verify Docker, frontend, backend, and DB.

    Run ./full_check.sh to test resume upload, AI chains, interview flow, and calendar/email.

    Use Postman collection for API tests.

10. Deployment

    Use Docker + cloud provider (AWS, GCP, Azure, Railway, Supabase)

    Set all .env variables in cloud

    Expose frontend (5173) & backend (4000) ports


11. Infra Folder

    Use this folder to add:
    - Terraform scripts
    - AWS S3 bucket provisioning
    - Supabase instance setup
    - IAM roles and policies
    - Any other infrastructure automation

