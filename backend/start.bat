@echo off
REM NexHire Backend - Windows Startup

set DB_URL=jdbc:postgresql://db.wqrtcxcwxkcevqyhsgzs.supabase.co:5432/postgres?sslmode=require
set DB_USER=postgres
set DB_PASSWORD=Rutu@76781060
set JWT_SECRET=nexhire-super-secret-jwt-key-2024-do-not-change-this-ever-ok
set ALLOWED_ORIGINS=http://localhost:5173
set PORT=8080
set GROQ_API_KEY=your-groq-api-key-here

echo Starting NexHire backend on port %PORT%...
mvn spring-boot:run