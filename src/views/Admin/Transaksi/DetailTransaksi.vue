<template lang="">
    <div class="h-screen mx-auto text-center" v-if="loading">
        <v-progress-circular class="mt-16" :size="128" :width="12" color="blue-darken-3"
            indeterminate></v-progress-circular>
    </div>
    <div v-else>
        <v-container class="w-75">
            <v-card class="px-4">
                <v-card-title class="text-center">Detail Transaksi</v-card-title>
                <v-card-text>
                    <div class="mt-4 w-50">
                        <v-row>
                        <v-col class="py-0">
                            Nomor Transaksi
                        </v-col>
                        <v-col class="py-0">
                            : {{ txsData.id }}
                        </v-col>
                        </v-row>
                        <v-row>
                        <v-col class="py-0">
                            Tanggal
                        </v-col>
                        <v-col class="py-0">
                            : {{ txsData.date }}
                        </v-col>
                    </v-row>
                    </div>
                </v-card-text>
                <v-table class="pa-4">
                    <thead>
                        <tr>
                            <th class="text-left">
                                Nama Produk
                            </th>
                            <th class="text-left">
                                Jumlah
                            </th>
                            <th class="text-left">
                                Harga (pcs)
                            </th>
                            <th class="text-left">
                                Total Harga
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in txsData.items" :key="item.index">
                            <td>{{item.product_name}}</td>
                            <td>{{item.quantity}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.total_price}}</td>
                        </tr>
                    </tbody>
                </v-table>
                <div class="mt-4 mb-8 ml-4 w-50">
                    <v-row>
                        <v-col class="py-0">
                            Total Transaksi
                        </v-col>
                        <v-col class="py-0">
                            : {{ txsData.final_price }}
                        </v-col>
                    </v-row>
                </div>
                <v-card-title class="text-center">Status Transaksi</v-card-title>
                <v-card-text>
                    <v-timeline class="mb-4" direction="horizontal">
                        <v-timeline-item v-for="list in transStatus" :key="list.index" :dot-color="getStatusColor(list.id)" size="small" >
                            {{list.status}}
                        </v-timeline-item>
                    </v-timeline>
                <div>
                    <v-btn v-if="txsData.status_id===4" class="mt-4" location="center" color="blue-darken-3" disabled>Transaksi Selesai</v-btn>
                    <v-btn v-else class="mt-4" location="center" color="blue-darken-3" @click="updateTrans(), loadingButton=true" :loading="loadingButton">
                        {{getButtonText(txsData.status_id)}}
                    </v-btn>
                </div>
                    
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
            loading:true,
            loadingButton:false,
            txsData: [],
            transStatus: [
                { id: 1, status: 'Menunggu Pembayaran' },
                { id: 2, status: 'Pembayaran Diterima' },
                { id: 3, status: 'Barang Dikirim' },
                { id: 4, status: 'Transaksi Selesai' },
            ]
        }
    },
    methods: {
        async loadTxs() {
            try {
                const txs = await axios.get(useEnvStore().apiUrl + 'txs/' + this.$route.params.id)
                console.log(txs)
                this.txsData = txs.data
                this.loading=false
            }
            catch (err) {
                console.log(err)
            }
        },
        updateTrans(){
            const updatedStatus=this.txsData.status_id+1
            axios.put(useEnvStore().apiUrl+'txs/'+this.$route.params.id,
            {
                status_id:updatedStatus
            },
            {
                headers:{
                    Authorization: 'Bearer '+useAuthStore().accessToken
                }
            })
            .then((res)=>{
                console.log(res)
                this.loadingButton=false
                this.loadTxs()
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        getStatusColor(listId) {
            if(listId === this.txsData.status_id){
                return "green"
            }
            else{
                return "grey"
            }
        },
        getButtonText(listId){
            switch(listId){
                case 1:
                    return 'Konfirmasi Pembayaran';
                case 2:
                    return 'Konfirmasi Pengiriman';
                case 3:
                    return 'Selesaikan Pesanan';
            }
        }
    },
    mounted() {
        this.loadTxs()
    },
}
</script>