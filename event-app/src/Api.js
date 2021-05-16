import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:4941/api/v1',
});

export const Events = {
    createNew: (title,
                description,
                categoryIds,
                date,
                isOnline,
                url,
                venue,
                capacity,
                requiresAttendanceControl,
                fee) => instance.post('events', {
        title,
        description,
        categoryIds,
        date,
        isOnline,
        url,
        venue,
        capacity,
        requiresAttendanceControl,
        fee
    }),

    getEvents: (searchTerm) => instance.get('events', {params: {'q': searchTerm}}),

    getEventData: (id) => instance.get(`events/${id}`, {}),

    deleteEvent: (id) => instance.delete(`events/${id}`, {}),
};

export const Users = {
    createNew: (firstName,
                lastName,
                email,
                password) => instance.post('users/register', {
        firstName,
        lastName,
        email,
        password
    }),

    login: (username, password) => instance.post('users/login', {username, password}),

    logout: () => instance.post('users/logout', {}),

    getUserData: (id) => instance.get(`users/${id}`, {}),
};