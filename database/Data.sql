

INSERT INTO users (username, email, password_hash, role) VALUES
('martin_lead', 'martin.v@tech-corp.cz', 'admin123', 'AUTHOR'),
('jana_dev', 'jana.novak@tech-corp.cz', 'password', 'SOLVER'),
('tomas_intern', 'tomas.k@tech-corp.cz', 'secret123', 'SOLVER');

-
-- Note: We refer to IDs 1, 2, 3 assuming the IDENTITY started at 1.
INSERT INTO tasks (title, description, status, author_id, solver_id) VALUES
('Fix login button alignment', 'The button is 5px too far left on mobile screens. Looks weird.', 'NEW', 1, 2),
('Create API for User Profile', 'Need the GET and POST endpoints ready by Friday.', 'STARTED', 1, 3),
('Update Homepage Banner', 'Swapped the old Xmas banner for the Spring one.', 'COMPLETED', 1, 2),
('Database Backup Script', 'Script failed on the staging server. Check the logs and fix it.', 'STARTED', 1, 3),
('Setup Git Repository', 'Initial commit and repo settings.', 'APPROVED', 1, 2);
 
-- 3. Populate Notifications
-- Using 1 for True, 0 for False
INSERT INTO notifications (user_id, task_id, message, is_read) VALUES
(2, 5, 'Great job, I approved the Git setup task.', 1),
(3, 4, 'Rejected: The backup script threw an error during the nightly run. Please fix.', 0);

-- 4. Populate Task History
INSERT INTO task_history (task_id, changed_by, previous_status, new_status, comment) VALUES
(4, 3, 'STARTED', 'COMPLETED', 'I think it is working now.'), 
(4, 1, 'COMPLETED', 'STARTED', 'Rejected: Script failed on staging.');