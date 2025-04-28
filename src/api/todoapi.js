import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:44322/api/todo',
    headers:{
        'Content-Type': 'application/json',
    }
});

export default {
    getAll() {
        return api.get('/');
    },
    get(id) {
        return api.get(`/${id}`);
    },
    create(todo) {
        return api.post('/', todo);
    },
    update(id, todo) {
        return api.put(`/${id}`, todo);
    },
    delete(id) {
        return api.delete(`/${id}`);
    },
};