<template lang="">
    <div>
        <v-container>
            <v-btn class="text-body-2 mb-4" color="blue-darken-3" prepend-icon="mdi-plus" @click="dialogAdd=true"> Tambah Admin
                <v-dialog v-model="dialogAdd">
                    <v-card class="w-25 pa-4 mx-auto">
                        <v-card-title>Tambah Akun Admin</v-card-title>
                        <v-text-field v-model="name" variant="outlined" density="compact" label="Name"></v-text-field>
                        <v-text-field v-model="email" variant="outlined" density="compact" label="Email"></v-text-field>
                        <v-text-field v-model="pass" variant="outlined" density="compact" label="Password"></v-text-field>
                        <v-text-field v-model="conpass" variant="outlined" density="compact" label="Confirm Password"></v-text-field>
                        <v-btn class="text-body-2 mt-2" color="blue-darken-3" @click="createAdmin()" :loading="loadingAdd">Tambahkan</v-btn>
                        <div class="text-center">
                            <p class="text-red text-caption">{{alert}}</p>
                        </div>
                    </v-card>
                </v-dialog>
            </v-btn>
            <EasyDataTable :headers="dataHeader" :items="admins">
                <template #item-role="item">
                    {{getRole(item.role)}}
                </template>
            </EasyDataTable>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios'

import { useAuthStore } from '@/store/authStore'
import { useEnvStore } from '@/store/envStore'
export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table']
    },
    data() {
        return {
            roleLoggedIn: useAuthStore().getRole,
            name: null,
            email: null,
            pass: null,
            conpass: null,
            roleToAdd: null,
            alert: null,
            dialogAdd: false,
            loadingAdd: false,
            admins: [],
            dataHeader: [
                { text: "id", value: 'id' },
                { text: "Nama", value: 'name' },
                { text: "Email", value: 'email' },
                { text: "Role", value: 'role' },
                { text: "", value: 'opsi', sortable: false }
            ]
        }
    },
    methods: {
        async getAdmins() {
            try {
                const admins = await axios.get(useEnvStore().apiUrl + 'admins', {
                    headers: {
                        Authorization: 'Bearer ' + useAuthStore().accessToken
                    }
                })
                console.log(admins)
                this.admins = admins.data
            }
            catch (err) {
                console.log(err)
                if(err.response.status===401){
                    this.$router.push({name: 'notfound'})
                }
            }
        },
        async createAdmin() {
            this.loadingAdd = true
            if (this.pass === this.conpass) {
                this.alert = null
                switch (this.roleLoggedIn) {
                    case 1:
                        this.roleToAdd = 2
                        break
                    case 2:
                        this.roleToAdd = 3
                        break
                }
                try {
                    const create = await axios.post(useEnvStore().apiUrl + 'admins/registers', {
                        name: this.name,
                        email: this.email,
                        password: this.pass,
                        confirm_password: this.conpass,
                        role: this.roleToAdd
                    },
                        {
                            headers: {
                                Authorization: 'Bearer ' + useAuthStore().accessToken
                            }
                        })
                    console.log(create)
                    this.dialogAdd = false
                    this.loadingAdd = false
                    this.getAdmins()
                }
                catch (err) {
                    console.log(err)
                }
            }
            else {
                this.alert = "Password doesn't match"
                this.loadingAdd = false
            }
        },
        getRole(id){
            switch(id){
                case 2:
                    return "Admin"
                case 3:
                    return "Teknisi"
            }
        }
    },
    mounted() {
        this.getAdmins()
    },
}
</script>
<style lang="">
    
</style>