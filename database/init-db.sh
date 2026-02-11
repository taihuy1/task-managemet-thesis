#!/bin/bash

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."
sleep 30s

# Create database
echo "Creating database..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P TaskManager123! -C -Q "CREATE DATABASE TaskManagerDB"

# Run the setup script
echo "Running initialization script..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P TaskManager123! -C -d TaskManagerDB -i /database/init.sql

echo "Database initialization complete!"
