-- Database initialization script for Task Management System
-- Creates tables and inserts sample data

-- Note: Database should already exist when this runs
-- Use TaskManagerDB;

-- Drop tables if they exist (for clean setup)
IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
IF OBJECT_ID('Tasks', 'U') IS NOT NULL DROP TABLE Tasks;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;

-- Create Users table
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL, 
    FullName NVARCHAR(100),
    UserRole NVARCHAR(20) NOT NULL CHECK (UserRole IN ('author', 'solver'))
);

-- Create Tasks table
CREATE TABLE Tasks (
    TaskID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    AuthorID INT NOT NULL,
    SolverID INT, 
    TaskStatus NVARCHAR(20) DEFAULT 'waiting' 
        CHECK (TaskStatus IN ('waiting', 'started', 'completed', 'approved', 'rejected')),
    RejectionReason NVARCHAR(MAX), 
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Tasks_Author FOREIGN KEY (AuthorID) REFERENCES Users(UserID),
    CONSTRAINT FK_Tasks_Solver FOREIGN KEY (SolverID) REFERENCES Users(UserID)
);

-- Create Notifications table
CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,       
    TaskID INT,
    Message NVARCHAR(255),
    IsRead BIT DEFAULT 0, 
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Notif_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Notif_Task FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID)
);

-- Insert sample users
-- NOTE: Passwords are stored in plain text for development/testing purposes only
-- In production, use bcrypt or another secure hashing algorithm
INSERT INTO Users (Username, Password, FullName, UserRole) VALUES 
('prof_vondrak', '123', 'Ivo Vondrak', 'author'),
('manager_smith', '123', 'John Smith', 'author'),
('student_tai', '123', 'Huy Tai Le', 'solver'),
('student_anna', '123', 'Anna Novak', 'solver'),
('student_pavel', '123', 'Pavel Svoboda', 'solver'),
('student_lucie', '123', 'Lucie Dvorak', 'solver');

-- Insert sample tasks
INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus) VALUES 
('Implement User Authentication', 'Create login functionality', 1, 3, 'waiting'),
('Design Database Schema', 'Design DB tables', 1, 4, 'waiting'),
('Build REST API Endpoints', 'Create CRUD endpoints', 1, 5, 'started'),
('Create React Dashboard', 'Build responsive dashboard', 1, 3, 'completed'),
('Setup Project Structure', 'Initialize project', 1, 4, 'approved'),
('Write Unit Tests', 'Create tests for API', 2, 6, 'waiting');

INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus, RejectionReason) VALUES 
('Fix Login Bug', 'Login button is broken', 1, 3, 'rejected', 'Button still does not work');

-- Insert sample notifications
INSERT INTO Notifications (UserID, TaskID, Message, IsRead) VALUES 
(3, 4, 'Great job! Your task has been approved.', 1),
(4, 5, 'Your completed task is pending review.', 0),
(6, 6, 'You have been assigned a new task: Write Unit Tests', 0);

-- Verify setup
SELECT COUNT(*) as UserCount FROM Users;
SELECT COUNT(*) as TaskCount FROM Tasks;
SELECT COUNT(*) as NotificationCount FROM Notifications;
