# Construction Management System

A comprehensive construction project management system built with Next.js 14 and FastAPI.

## Tech Stack

- Frontend: Next.js 14, TypeScript, TailwindCSS
- Backend: FastAPI, PostgreSQL
- Authentication: Supabase Auth
- State Management: Zustand
- Charts: Recharts

## Features

- Employee Status Tracking
- Project Progress Dashboard
- Materials Inventory Management
- Real-time Status Updates
- Performance Analytics
- Supplier Price Comparison
- Time Tracking

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Create `.env.local` in frontend directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

Create `.env` in backend directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_secret_key
```

## API Routes

### Employees
- GET /api/employees
- GET /api/employees/{id}/status
- GET /api/employees/{id}/performance

### Projects
- GET /api/projects
- GET /api/projects/{id}/progress

### Materials
- GET /api/materials
- GET /api/materials/availability

## Development

### Directory Structure

```
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
└── backend/
    ├── api/
    ├── models/
    └── tests/
```

## Testing

### Frontend
```bash
npm run test
```

### Backend
```bash
pytest
```

## Deployment

### Frontend
```bash
npm run build
npm run start
```

### Backend
```bash
gunicorn main:app
```

## License

MIT