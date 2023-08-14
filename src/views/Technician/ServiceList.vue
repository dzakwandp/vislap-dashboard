<template lang="">
    <div>
        <v-container>
            <EasyDataTable :items="serviceList" :headers="dataHeader">
                <template #item-opsi="item">
                    <v-btn v-if="item.status_id===1" class="ma-2" color="blue-darken-3" size="small" prepend-icon="mdi-check" @click="dialogProc=true, serviceId=item.id">Accept
                        <v-dialog v-model="dialogProc">
                            <v-card class="w-50 mx-auto">
                                <v-card-title class="text-blue-darken-3">
                                    Konfirmasi Service
                                </v-card-title>
                                <v-textarea class="mx-4" v-model="message2" auto-grow label="Message (optional)" variant="outlined">
                                </v-textarea>
                                <v-textarea class="mx-4" v-model="message3" auto-grow label="Message (optional)" variant="outlined">
                                </v-textarea>
                                <v-card-actions>
                                    <v-btn class="mx-auto text-body-2" variant="outlined" color="blue-darken-3" @click="acceptService()">Accept</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-btn>
                    <v-btn v-if="item.status_id===2" class="ma-2" size="small" color="green-darken-3" prepend-icon="mdi-check" :loading="loadingFinish" 
                    @click="loadingFinish=true, message2=item.message2, message3=item.message3, finishService(item.id)">Finish</v-btn>
                </template>
            </EasyDataTable>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios';

import { useAuthStore } from '@/store/authStore';
import { useEnvStore } from '@/store/envStore';
export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table']
    },
    data() {
        return {
            message2:"",
            message3:"",
            serviceId: null,
            dialogProc: false,
            loadingFinish: false,
            selectedId: null,
            serviceList: [],
            dataHeader: [
                { text: "id", value: 'id' },
                { text: "Date", value: 'date' },
                { text: "User", value: 'user.name' },
                { text: "WA User", value: 'wa_user' },
                { text: "Status", value: 'service_status.status_name' },
                { text: "", value: 'opsi', sortable: false }
            ]
        }
    },
    methods: {
        async getServiceList() {
            try {
                const service = await axios.get(useEnvStore().apiUrl + 'services/technician', {
                    headers: {
                        Authorization: 'Bearer ' + useAuthStore().accessToken
                    }
                })
                console.log(service)
                this.serviceList = service.data
            }
            catch (err) {
                console.log(err)
            }
        },
        async acceptService() {
            try {
                const accept = await axios.put(useEnvStore().apiUrl + 'services/technician/' + this.serviceId, {
                    message2: this.message2,
                    message3: this.message3,
                    status_id: 2
                },
                    {
                        headers: {
                            Authorization: 'Bearer ' + useAuthStore().accessToken
                        }
                    })
                    console.log(accept)
                    this.dialogProc=false
                    this.getServiceList()
            }
            catch (err) {
                console.log(err)
            }
        },
        async finishService(id){
            try{
                const finish = await axios.put(useEnvStore().apiUrl + 'services/technician/' + id, {
                    message2: this.message2,
                    message3: this.message3,
                    status_id: 3
                },
                    {
                        headers: {
                            Authorization: 'Bearer ' + useAuthStore().accessToken
                        }
                    })
                    console.log(finish)
                    this.getServiceList()
            }
            catch(err){
                console.log(err)
            }
        }
    },
    mounted() {
        this.getServiceList()
    },
}
</script>
<style lang="">
    
</style>