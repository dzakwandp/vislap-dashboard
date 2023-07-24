<template>
    <v-app>
        <v-main>
            <div class="d-flex h-screen align-center justify-center">
                <div class="d-flex flex-column text-grey-darken-2">
                    <div class="text-h4">Welcome back!</div>
                    <div class="text-caption">Let's start manage Vislap's website!</div>
                    <v-sheet width="350" class="mx-auto mt-8 text-indigo-darken-4">
                        <v-form>
                            <v-text-field clearable label="username" variant="outlined"
                                prepend-inner-icon="mdi-account-circle" v-model="username"></v-text-field>
                        </v-form>
                        <v-form>
                            <v-text-field label="password" variant="outlined" prepend-inner-icon="mdi-shield-key"
                                v-model="password" :append-inner-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showpass ? 'text' : 'password'"
                                @click:append-inner="showpass = !showpass"></v-text-field>
                        </v-form>
                    </v-sheet>
                    <v-btn @click="onLogin(), loading=true" class="text-body-1" color="indigo-darken-4">Login</v-btn>
                    <small v-text="errormsg" class="text-red"></small>
                    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
                </div>
            </div>
        </v-main>
    </v-app>
    <v-layout>
        <v-footer class="mt-n10 text-body-2 justify-center text-grey-darken-2">&#169; Vislap 2023</v-footer>
    </v-layout>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode'
// import VueCokie from 'vue-cookies'

import { useEnvStore } from '@/store/envStore';
export default {
    data() {
        return {
            showpass: false,
            username: '',
            password: '',
            loading: false,
            errormsg: '',
        }
    },
    methods: {
        async onLogin(){
            try{
                const login=await axios.post(useEnvStore().apiUrl+"users/login/",{
                    username: this.username,
                    password: this.password
                })
                console.log(login)
                this.decodejwt(login.data.access_token)
                this.aquireToken()
                this.loading=false
            }
            catch(err){
                console.log(err)
                this.loading=false
            }
        },
        aquireToken(){
            axios.get(useEnvStore().apiUrl+"token")
            .then((res)=>{
                console.log(res)
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        decodejwt(acctoken){
            const token=acctoken
            const secret=import.meta.env.VITE_ACCESS_TOKEN_SECRET
            try{
                const decoded= jwt_decode(token, secret)
                console.log(decoded)
            }
            catch(err){
                console.log(err)
            }
        }
    },
}
</script>
<style lang="">
    
</style>