#!/bin/bash
# NexHire Backend - Mac/Linux Startup
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
  echo "✅ Loaded .env"
fi
echo "🚀 Starting backend on port ${PORT:-8080}..."
mvn spring-boot:run -q
