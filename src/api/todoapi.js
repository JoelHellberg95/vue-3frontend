import axios from 'axios';

const api = axios.create({
    baseURL: 'https://todoapi-dq99.onrender.com/api/todo', // ✅ Your Render API
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    getAll: () => api.get('/'),
    create: (todo) => api.post('/', todo),
    update: (id, todo) => api.put(`/${id}`, todo),
    delete: (id) => api.delete(`/${id}`),
};
