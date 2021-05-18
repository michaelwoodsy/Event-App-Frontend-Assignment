import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:4941/api/v1',
});

export const Event = {
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

    getEvents: () => instance.get('events', {}),

    searchEvents: (searchTerm) => instance.get('events', {params: {'q': searchTerm}}),

    getEventData: (id) => instance.get(`events/${id}`, {}),

    deleteEvent: (id) => instance.delete(`events/${id}`, {}),
};

export const User = {
    createNew: (firstName,
                lastName,
                email,
                password) => instance.post('users/register', {
        firstName,
        lastName,
        email,
        password
    }),

    login: (email, password) => instance.post('users/login', {email, password}),

    logout: () => instance.post('users/logout', {}),

    getUserData: (id) => instance.get(`users/${id}`, {}),

    editUserData: (id, userData) => instance.patch(`users/${id}`, userData),

    setAuthorizationHeader: (token) => instance.defaults.headers.common['X-Authorization'] = token
};

export const UserImage = {
    setUserImage: (id, file, type) => instance.put(`users/${id}/image`, file, {headers: {'Content-Type': `${type}`}}),

    getUserImage: (id) => instance.get(`users/${id}/image`, {responseType: 'arraybuffer'}),

    deleteUserImage: (id) => instance.delete(`users/${id}/image`, {}),
}