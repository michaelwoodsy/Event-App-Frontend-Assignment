import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { User } from "../Api"

export const store = createStore({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],

    state: {
        authToken: "",
        userId: null,
    },

    getters:{
        isLoggedIn(state) {
            return state.authToken.length > 0
        }
    },

    mutations:{
        updateToken(state, newToken) {
            state.authToken = newToken;
            User.setAuthorizationHeader(newToken)
        },

        updateUser(state, userId) {
            state.userId = userId;
        }
    },

    actions:{
        login({ commit }, newToken, userId) {
            commit('updateToken', newToken)
            commit('updateUser', userId)
        },

        logout({ commit }) {
            commit('updateToken', "")
            commit('updateUser', null)
        },
    }
});