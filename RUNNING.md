# Run both projects locally

Prerequisites:
- Node.js >= 18
- MongoDB running locally or accessible via a connection string

Backend (api):

1. Open a terminal and change directory:

   cd backend

2. Copy the example env and edit values:

   (Windows PowerShell)
   copy .env.example .env

3. Install and start:

   npm install
   npm run dev

4. Optional: seed sample data:

   npm run seed

Frontend (client):

1. In a separate terminal, change directory:

   cd frontend

2. Copy the example env and edit if needed:

   (Windows PowerShell)
   copy .env.example .env

3. Install and start dev server:

   npm install
   npm run dev

Notes:
- Backend expects `MONGODB_URI` in `.env`.
- Frontend will call the API at the URL defined by `VITE_API_URL` in `.env`.
