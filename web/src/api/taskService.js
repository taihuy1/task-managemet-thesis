import axiosClient from './axiosClient';

// Centralized API service layer
// Benefits: Single source of truth for API endpoints, easier to maintain and test
const taskService = {
  login: function (email, password) {
    return axiosClient.post('/auth/login', { email, password });
  },

  logout: function () {
    return axiosClient.post('/auth/logout');
  },

  getAllTasks: function () {
    return axiosClient.get('/task/');
  },

  getTaskById: function (taskId) {
    return axiosClient.get(`/task/${taskId}`);
  },

  createTask: function (taskData) {
    return axiosClient.post('/task/', taskData);
  },

  updateTask: function (taskId, taskData) {
    return axiosClient.put(`/task/${taskId}`, taskData);
  },

  deleteTask: function (taskId) {
    return axiosClient.delete(`/task/${taskId}`);
  },

  startTask: function (taskId) {
    return axiosClient.post('/request/rely/start', { taskId });
  },

  completeTask: function (taskId, result) {
    return axiosClient.post('/request/rely/complete', { taskId, result });
  },

  approveTask: function (taskId) {
    return axiosClient.post('/request/rely/approved', { taskId });
  },

  rejectTask: function (taskId, reason) {
    return axiosClient.post('/request/rely/rejected', { taskId, reason });
  },

  getNotifications: function () {
    return axiosClient.get('/notifications');
  },

  markNotificationRead: function (notifId) {
    return axiosClient.put(`/notifications/${notifId}/read`);
  },

  getSolvers: function () {
    return axiosClient.get('/users/solvers');
  },

  assignTask: function (taskId, solverId) {
    return axiosClient.post('/request/send', { taskId, solvers: [solverId] });
  }
};

export default taskService;
