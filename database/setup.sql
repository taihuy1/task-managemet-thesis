use TaskManagerDB;
GO

--DROP TABLE Users;

--DROP TABLE Tasks;

--drop table Notifications;


-- 2. Create Users Table 
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100),

    UserRole NVARCHAR(20) NOT NULL CHECK (UserRole IN ('author', 'solver'))
);
GO

-- 3. Create Tasks Table 
CREATE TABLE Tasks (
    TaskID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    
    -- Foreign Keys
    AuthorID INT NOT NULL,
    SolverID INT, 
    
    
    TaskStatus NVARCHAR(20) DEFAULT 'new' 
        CHECK (TaskStatus IN ('new', 'assigned', 'started', 'completed', 'approved')),
    
    RejectionReason NVARCHAR(MAX), 
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Tasks_Author FOREIGN KEY (AuthorID) REFERENCES Users(UserID),
    CONSTRAINT FK_Tasks_Solver FOREIGN KEY (SolverID) REFERENCES Users(UserID)
);
GO

-- 4. Create Notifications Table 
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
('prof_vondrak', '123', 'Ivo Vondrak', 'author'),
('student_tai', '123', 'Huy Tai Le', 'solver');
GO

select * from Users;