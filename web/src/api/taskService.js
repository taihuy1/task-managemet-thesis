
import axiosClient from './axiosClient';

const taskService = {

  login: (username, password) => {
    return axiosClient.post('/auth/login', { username, password });
  },
  logout: () => {
    return axiosClient.post('/auth/logout');
  },
  

  getAllTasks: () => {
    return axiosClient.get('/task/');
  },

  startTask: (taskId) => {
    return axiosClient.post('/request/rely/start', { taskId });
  },
  completeTask: (taskId, result) => {
    return axiosClient.post('/request/rely/complete', { taskId, result });
  }
};

export default taskService;