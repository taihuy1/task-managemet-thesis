use TaskManagerDB;
GO


--DROP TABLE Notifications;
--DROP TABLE Tasks;
--DROP TABLE Users;


CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL, 
    FullName NVARCHAR(100),

    UserRole NVARCHAR(20) NOT NULL CHECK (UserRole IN ('author', 'solver'))
);
GO


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
GO


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
GO


INSERT INTO Users (Username, Password, FullName, UserRole)
VALUES 
('prof_vondrak', '123', 'Ivo Vondrak', 'author'),    -- ID 1
('manager_smith', '123', 'John Smith', 'author'),     -- ID 2
('student_tai', '123', 'Huy Tai Le', 'solver'),       -- ID 3
('student_anna', '123', 'Anna Novak', 'solver'),      -- ID 4
('student_pavel', '123', 'Pavel Svoboda', 'solver'),  -- ID 5
('student_lucie', '123', 'Lucie Dvorak', 'solver');   -- ID 6
GO



INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus)
VALUES 
('Implement User Authentication', 'Create login functionality', 1, 3, 'waiting');

INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus)
VALUES 
('Design Database Schema', 'Design DB tables', 1, 4, 'waiting');

INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus)
VALUES 
('Build REST API Endpoints', 'Create CRUD endpoints', 1, 5, 'started');


INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus)
VALUES 
('Create React Dashboard', 'Build responsive dashboard', 1, 3, 'completed');


INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus)
VALUES 
('Setup Project Structure', 'Initialize project', 1, 4, 'approved');


INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus)
VALUES 
('Write Unit Tests', 'Create tests for API', 2, 6, 'waiting');


INSERT INTO Tasks (Title, Description, AuthorID, SolverID, TaskStatus, RejectionReason)
VALUES 
('Fix Login Bug', 'Login button is broken', 1, 3, 'rejected', 'Button still does not work');
GO


INSERT INTO Notifications (UserID, TaskID, Message, IsRead)
VALUES 
(3, 4, 'Great job! Your task has been approved.', 1),
(4, 5, 'Your completed task is pending review.', 0),
(6, 6, 'You have been assigned a new task: Write Unit Tests', 0);
GO


SELECT * FROM Users;
SELECT * FROM Tasks;
SELECT * FROM Notifications;