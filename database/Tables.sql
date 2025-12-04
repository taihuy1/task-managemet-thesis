use Thesis_Users;

CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Storing plain text as requested for now
    role VARCHAR(20) NOT NULL CHECK (role IN ('AUTHOR', 'SOLVER')), 
    created_at DATETIME DEFAULT GETDATE()
);

-- Create Tasks Table
CREATE TABLE tasks (
    task_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(MAX), -- Replaces TEXT
    status VARCHAR(20) DEFAULT 'NEW', 
    
    -- Relationships
    author_id INT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    solver_id INT FOREIGN KEY REFERENCES users(user_id),
    
    -- Timestamps
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create Task History Table (Audit Log)
CREATE TABLE task_history (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    task_id INT NOT NULL FOREIGN KEY REFERENCES tasks(task_id) ON DELETE CASCADE,
    changed_by INT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    comment VARCHAR(MAX), 
    changed_at DATETIME DEFAULT GETDATE()
);

-- Create Notifications Table
CREATE TABLE notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES users(user_id),
    task_id INT FOREIGN KEY REFERENCES tasks(task_id),
    message VARCHAR(MAX) NOT NULL,
    is_read BIT DEFAULT 0, -- 0 = False, 1 = True
    created_at DATETIME DEFAULT GETDATE()
);

