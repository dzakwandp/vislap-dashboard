<template lang="">
    <div>
        <v-container>
            <div class="text-right mb-4">
                <v-btn color="blue-darken-3" prepend-icon="mdi-plus" @click="this.$router.push('/addproduct')">Tambah</v-btn>
            </div>
            <EasyDataTable :headers="dataHeader" :items="product" theme-color="#1565C0" :loading="loading">
                <template #item-opsi="item" v-slot:item.actions="{item}">
                    <v-btn icon="mdi-eye" color="blue-darken-3" variant="text" @click="toProdDetail(item.id)"></v-btn>
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
            product: [],
            dataHeader: [
                { text: "id", value: 'id' },
                { text: "Nama", value: 'nama' },
                { text: "Harga", value: 'harga' },
                { text: "Kategori", value: 'kategori' },
                { text: "", value: 'opsi', sortable: false }
            ]
        }
    },
    methods: {
        toProdDetail(id) {
            this.$router.push('/product/' + id)
        },
        async getProduct() {
            try {
                const prod = await axios.get(useEnvStore().apiUrl + 'products')
                console.log(prod)
                this.product = prod.data
                this.loading = false
            }
            catch (err) {
                console.log(err)
                this.loading = false
                if(err.response.status===401){
                    this.$router.push({name: 'notfound'})
                }
            }
        }
    },
    mounted() {
        this.getProduct()
    },
}
</script>