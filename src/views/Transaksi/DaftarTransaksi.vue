<template lang="">
    <div>
        <v-container>
            <EasyDataTable :loading="loading" :headers="tableHeader" :items="txData" theme-color="#1565C0">
                <template #item-details="item" v-slot:item.actions="{item}">
                    <v-btn icon="mdi-eye" color="blue-darken-3" variant="text" @click="toTxDetail(item.id)"></v-btn>
                </template>
            </EasyDataTable>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios';

import { useEnvStore } from '@/store/envStore'
export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table']
    },
    data() {
        return {
            loading: true,
            tableHeader:[
                {text:'id', value:'id'},
                {text:'Tanggal', value:'date'},
                {text:'Total Invoice', value:'final_price'},
                {text:'Status', value:'status.status'},
                {text:'', value:'details'}
            ],
            txData:[]
        }
    },
    methods: {
        async getTxsData() {
            try {
                const txs = await axios.get(useEnvStore().apiUrl + 'txs')
                console.log(txs)
                this.txData=txs.data
                this.loading=false
            }

            catch (err) {
                console.log(err)
            }
        },
        toTxDetail(id){
            this.$router.push('/txs/'+id)
        }
    },
    mounted() {
        this.getTxsData()
    },
}
</script>