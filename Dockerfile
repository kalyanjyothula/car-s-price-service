# Stage 1: Build React frontend
FROM node:18-alpine as frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
COPY frontend/.env .env     
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build FastAPI backend
FROM python:3.10-slim as backend

# Set work directory
WORKDIR /app

# Copy FastAPI app
COPY backend/ /app/backend/
COPY backend/artifacts /app/backend/artifacts
COPY backend/.env /app/backend/.env
COPY backend/requirements.txt .

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy built React frontend into FastAPI static folder
COPY --from=frontend-build /frontend/dist /app/backend/frontend

# Expose port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
