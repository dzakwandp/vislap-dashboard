import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        name: null,
        role: null,
        isLoggedIn: false
    }),
    actions: {
        getToken(token) {
            this.accessToken = token
        },
        login(response) {
            this.isLoggedIn = true,
            this.role=response.role
                this.name = response.name
        },
        logout() {
            this.isLoggedIn = false,
            this.role=null,
                this.name = null,
                this.accessToken = null
        }
    },
    getters: {
        loginStatus() {
            return this.isLoggedIn
        },
        getUsername() {
            return this.name
        },
        getRole(){
          return this.role
        }
    },
    persist: {
        storage: sessionStorage
    }
})