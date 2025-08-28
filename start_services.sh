#!/bin/bash

echo "Starting NeverMore Caterpillar Services..."
echo

echo "Starting Backend Server..."
cd Backend
python run.py &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting Frontend Server..."
cd "../Caterpillar FrontEnd"
npm run dev &
FRONTEND_PID=$!

echo
echo "Services are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all services..."

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
