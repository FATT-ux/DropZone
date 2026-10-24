//ЭТОТ ФАЙЛ НУЖЕН ЧТОБЫ ПРИ ОКОНЧАНИИ ТОКЕНА НАС ВЫБРАСЫВАЛО 
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (window.location.pathname !== '/Login'){
                window.location.href = '/Login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;