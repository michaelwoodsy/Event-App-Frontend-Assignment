import {Users} from "../Api";

export default {
    register(firstName, lastName, email, password) {
        return new Promise((resolve, reject) => {
            Users.createNew(firstName, lastName, email, password)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    login(username, password) {
        // Return a promise for the api call
        return new Promise((resolve, reject) => {
            Users.login(username, password)
                .then((res) => {
                    // Set logged in then resolve the promise
                    this.setLoggedIn(res.data.userId);
                    resolve(res)
                })
                .catch((err) => {
                    // Set logged out then reject the promise
                    this.setLoggedOut();
                    reject(err)
                })
        })
    },
}
