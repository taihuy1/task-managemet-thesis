import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials : true, 
    headers: {
        'Content-Type': 'application/json',
    },
    
});

axiosClient.interceptors.response.use((congfig) => {    
    const token = localStorage.getItem('accessToken');
    if (token) {
        congfig.headers['Authorization'] = `Bearer ${token}`;

    }
    return congfig;
});

export default axiosClient;
