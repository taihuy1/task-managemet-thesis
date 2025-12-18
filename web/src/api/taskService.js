import axiosClient from './axiosClient';

const taskService = {
  login: function(username, password) {
    return axiosClient.post('/auth/login', { username, password });
  },

  logout: function() {
    return axiosClient.post('/auth/logout');
  },

  getAllTasks: function() {
    return axiosClient.get('/task/');
  },

  getTaskById: function(taskId) {
    return axiosClient.get('/task/' + taskId);
  },

  createTask: function(taskData) {
    return axiosClient.post('/task/', taskData);
  },

  updateTask: function(taskId, taskData) {
    return axiosClient.put('/task/' + taskId, taskData);
  },

  deleteTask: function(taskId) {
    return axiosClient.delete('/task/' + taskId);
  },

  startTask: function(taskId) {
    return axiosClient.post('/request/rely/start', { taskId: taskId });
  },

  completeTask: function(taskId, result) {
    return axiosClient.post('/request/rely/complete', { taskId: taskId, result: result });
  },

  approveTask: function(taskId) {
    return axiosClient.post('/request/rely/approved', { taskId: taskId });
  },

  rejectTask: function(taskId, reason) {
    return axiosClient.post('/request/rely/rejected', { taskId: taskId, reason: reason });
  },

  getNotifications: function() {
    return axiosClient.get('/notifications');
  },

  markNotificationRead: function(notifId) {
    return axiosClient.put('/notifications/' + notifId + '/read');
  },

  getSolvers: function() {
    return axiosClient.get('/users/solvers');
  },

  assignTask: function(taskId, solverId) {
    return axiosClient.post('/request/send', { taskId: taskId, solvers: [solverId] });
  }
};

export default taskService;
