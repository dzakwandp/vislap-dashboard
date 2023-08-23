<template lang="">
    <div class="h-screen mx-auto text-center" v-if="loading">
        <v-progress-circular class="mt-16" :size="128" :width="12" color="blue-darken-3"
            indeterminate></v-progress-circular>
    </div>
    <div v-else>
        <v-container class="w-75">
            <v-btn v-if="role===2" color="blue-darken-3" variant="text" prepend-icon="mdi-arrow-left" @click="this.$router.push('/service_admin')">Back</v-btn>
            <v-btn v-if="role===3" color="blue-darken-3" variant="text" prepend-icon="mdi-arrow-left" @click="this.$router.push('/service_tech')">Back</v-btn>
            <v-card class="px-4">
                <v-card-title class="text-center">Detail Service</v-card-title>
                <v-card-text>
                    <div class="mt-4 w-50">
                        <v-row>
                        <v-col class="py-0">
                            Tanggal
                        </v-col>
                        <v-col class="py-0">
                            : {{ serviceData.date }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            Status
                        </v-col>
                        <v-col class="py-0">
                            : {{ serviceData.service_status.status_name }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            User
                        </v-col>
                        <v-col class="py-0">
                            : {{ serviceData.user.name }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            Technician
                        </v-col>
                        <v-col class="py-0">
                            : {{ serviceData.technician.name }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            Price
                        </v-col>
                        <v-col class="py-0">
                            : {{ formatCurrency(serviceData.price) }}
                        </v-col>
                    </v-row>
                    </div>
                </v-card-text>
                <v-card class="mb-4">
                    <v-card-title>
                        Message from User
                    </v-card-title>
                    <v-card-text>
                        {{serviceData.message1}}
                    </v-card-text>
                </v-card>
                <v-card class="mb-4">
                    <v-card-title>
                        Message from Technician
                    </v-card-title>
                    <v-card-text>
                        {{serviceData.message2}}
                    </v-card-text>
                </v-card>
                <v-card class="mb-4">
                    <v-card-title>
                        Message from Technician
                    </v-card-title>
                    <v-card-text>
                        {{serviceData.message3}}
                    </v-card-text>
                </v-card>
                <v-card-title class="text-center">Status Transaksi</v-card-title>
                <v-card-text>
                    <v-timeline class="mb-4" direction="horizontal">
                        <v-timeline-item v-for="list in servStatus" :key="list.index" :dot-color="getStatusColor(list.id)" size="small" >
                            {{list.status}}
                        </v-timeline-item>
                    </v-timeline>                    
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios'

import { useEnvStore } from '@/store/envStore'
import { useAuthStore } from '@/store/authStore'
export default {
    data() {
        return {
            role: useAuthStore().getRole,
            loading: true,
            loadingButton: false,
            serviceData: [],
            servStatus: [
                { id: 1, status: 'Pending' },
                { id: 2, status: 'Diproses' },
                { id: 3, status: 'Selesai' },
            ]
        }
    },
    methods: {
        async loadService() {
            try {
                const service = await axios.get(useEnvStore().apiUrl + 'services/' + this.$route.params.id, {
                    headers: {
                        Authorization: 'Bearer ' + useAuthStore().accessToken
                    }
                })
                console.log(service)
                this.serviceData = service.data
                this.loading = false
            }
            catch (err) {
                console.log(err)
                if(err.response.status===401){
                    this.$router.push({name: 'notfound'})
                }
            }
        },
        getStatusColor(listId) {
            if (listId === this.serviceData.service_status.id) {
                return "green"
            }
            else {
                return "grey"
            }
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
        }
    },
    mounted() {
        this.loadService()
    },
}
</script>