<template lang="">
    <div>
        <v-container class="w-50">
            <div class="text-right">
                <v-dialog class="w-50" v-model="dialogadd">
                    <template v-slot:activator="{props}">
                        <v-btn class="text-body-2 mb-4" color="blue-darken-3" v-bind="props">Tambah</v-btn>
                    </template>
                    <v-container>
                        <v-card>
                            <v-card-title>Tambah Kategori</v-card-title>
                            <v-text-field class="mx-4" v-model="categoryName" variant="outlined" density="comfortable"></v-text-field>
                            <v-btn class="text-body-2 mt-4" location="center" color="blue-darken-3" :loading="buttonLoading" @click="buttonLoading=true,addCat()">Tambahkan</v-btn>
                        </v-card>
                    </v-container>
                </v-dialog>
            </div>
            <EasyDataTable :headers="header" :items="category"></EasyDataTable>
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
            buttonLoading:false,
            dialogadd: false,
            categoryName: null,
            header: [
                { text: "Kategori", value: 'name' }
            ],
            category: []
        }
    },
    methods: {
        async getCat() {
            try {
                const cat = await axios.get(useEnvStore().apiUrl + 'category')
                this.category = cat.data
            }
            catch (err) {
                console.log(err)
            }
        },
        async addCat() {
            try {
                const cat = await axios.post(useEnvStore().apiUrl + 'category', {
                    name: this.categoryName
                })
                this.dialogadd=false
                this.getCat()
            }
            catch(err){
                console.log(err)
            }
        }
    },
    mounted() {
        this.getCat()
    },
}
</script>
<style lang="">
    
</style>