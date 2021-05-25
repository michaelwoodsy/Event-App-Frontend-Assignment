import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:4941/api/v1',
});

export const Event = {
    createNew: (eventData) => instance.post('events', eventData),

    getEvents: (filter) => instance.get('events', {params: {'sortBy': filter}}),

    searchEvents: (searchTerm, filter) => instance.get('events', {params: {'q': searchTerm, 'sortBy': filter}}),

    filterEvents: (categoryIds, filter) => instance.get('events', {params: {'categoryIds': categoryIds, 'sortBy': filter}}),

    searchFilterEvents: (searchTerm, categoryIds, filter) => instance.get('events', {params: {'q': searchTerm, 'categoryIds': categoryIds, 'sortBy': filter}}),

    getEventData: (id) => instance.get(`events/${id}`, {}),

    getCategories: () => instance.get(`events/categories`, {}),

    editEvent: (id, eventData) => instance.patch(`events/${id}`, eventData),

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

export const EventImage = {
    setEventImage: (id, file, type) => instance.put(`events/${id}/image`, file, {headers: {'Content-Type': `${type}`}}),

    getEventImage: (id) => instance.get(`events/${id}/image`, {responseType: 'arraybuffer'}),
}

export const EventAttendee = {
    getEventAttendees: (id) => instance.get(`events/${id}/attendees`,{}),

    requestAttendance: (id) => instance.post(`events/${id}/attendees`,{}),

    removeAttendance: (id) => instance.delete(`events/${id}/attendees`,{}),

    changeAttendance: (eventId, userId, status) => instance.patch(`events/${eventId}/attendees/${userId}`, status),

}