<template lang="">
    <div>
        <v-container class="w-50">
            <div class="text-right">
                <v-dialog class="w-50" v-model="dialogadd">
                    <template v-slot:activator="{props}">
                        <v-btn class="text-body-2 mb-4" color="blue-darken-3" v-bind="props" prepend-icon="mdi-plus">Tambah</v-btn>
                    </template>
                    <v-container>
                        <v-card>
                            <v-card-title>Tambah Kategori</v-card-title>
                            <v-text-field class="mx-4" v-model="categoryName" variant="outlined" density="compact"></v-text-field>
                            <v-btn class="text-body-2 mt-4" location="center" color="blue-darken-3" :loading="buttonLoading" @click="buttonLoading=true,addCat()">Tambahkan</v-btn>
                        </v-card>
                    </v-container>
                </v-dialog>
            </div>
            <EasyDataTable :headers="header" :items="category" :loading="loading" theme-color="#1565C0" header-text-direction="center" body-text-direction="center">
                <template #item-action="item">
                    <!-- dialog edit -->
                    <v-dialog v-model="dialogEdit">
                    <template v-slot:activator="{props}" v-slot:item.actions="{item}">
                        <v-btn icon="mdi-pencil" variant="text" color="orange-darken-1" v-bind="props" @click="getData(item.id, item.name)"></v-btn>
                    </template>
                    <v-card class="w-50 mx-auto">
                        <v-card-title>Edit Kategori
                        <v-btn location="right top" position="absolute" icon="mdi-close-circle-outline" variant="text" color="red" @click="dialogEdit=false"></v-btn>
                        </v-card-title>
                        <v-text-field class="mx-4" v-model="categoryNameById" variant="outlined" density="compact"></v-text-field>
                        <v-card-action class="mx-auto mb-4">
                            <v-btn color="orange-darken-1" :loading="loadingBtn" @click="updateCat(), loadingBtn=true">Edit</v-btn>
                        </v-card-action>
                    </v-card>
                    </v-dialog>
                    <!-- dialog delete -->
                    <v-dialog v-model="dialogDelete">
                    <template v-slot:activator="{props}" v-slot:item.actions="{item}">
                        <v-btn icon="mdi-delete" variant="text" color="red-darken-1" v-bind="props" @click="getData(item.id, item.name)"></v-btn>
                    </template>
                    <v-card class="w-50 mx-auto">
                        <v-card-title>Hapus Kategori
                        </v-card-title>
                        <v-card-text>Apakah anda yakin?</v-card-text>
                        <v-card-action class="mx-auto mb-4">
                            <v-btn color="red-darken-1" :loading="loadingBtn" @click="deleteCat(), loadingBtn=true">Yakin</v-btn>
                            <v-btn class="ml-8" color="blue-darken-1" @click="dialogDelete=false">Tidak</v-btn>
                        </v-card-action>
                    </v-card>
                    </v-dialog>
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
            dialogEdit: false,
            dialogDelete: false,
            loadingBtn: false,
            loading: true,
            buttonLoading: false,
            dialogadd: false,
            categoryName: null,
            categoryNameById: null,
            categoryId: null,
            header: [
                { text: "Kategori", value: 'name' },
                { text: "", value: 'action' }
            ],
            category: []
        }
    },
    methods: {
        async getCat() {
            try {
                const cat = await axios.get(useEnvStore().apiUrl + 'category')
                this.category = cat.data
                this.loading = false
            }
            catch (err) {
                console.log(err)
                if(err.response.status===401){
                    this.$router.push({name: 'notfound'})
                }
            }
        },
        async addCat() {
            try {
                const cat = await axios.post(useEnvStore().apiUrl + 'category', {
                    name: this.categoryName
                })
                this.dialogadd = false
                this.getCat()
            }
            catch (err) {
                console.log(err)
            }
        },
        getData(id, val) {
            this.categoryId = id
            this.categoryNameById = val
        },
        updateCat() {
            axios.put(useEnvStore().apiUrl + 'category/' + this.categoryId, {
                name: this.categoryNameById
            })
                .then((res) => {
                    this.loadingBtn = false
                    this.dialogEdit = false
                    this.loading = true
                    this.getCat()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        deleteCat() {
            axios.delete(useEnvStore().apiUrl + 'category/' + this.categoryId)
                .then((res) => {
                    this.loadingBtn = false
                    this.dialogDelete = false
                    this.loading = true
                    this.getCat()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    },
    mounted() {
        this.getCat()
    },
}
</script>
<style lang="">
    
</style>