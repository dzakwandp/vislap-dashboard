<template lang="">
    <div>
        <v-container class="w-75">
            <div>
            <v-btn class="mb-4 text-body-2" variant="text" prepend-icon="mdi-arrow-left" color="grey-darken-1" @click="this.$router.push('/products')">Kembali</v-btn>
            </div>
            <v-card class="mx-auto pa-8">
                <v-card-title class="ml-n4 mb-4 mt-n4">Detail Produk</v-card-title>
                <div v-if="loading" class="text-center">
                    <v-progress-circular indeterminate :size="128" :width="12" color="blue-darken-3"></v-progress-circular>
                </div>
                <v-form v-else @submit.prevent="updateProduct" enctype="multipart/form-data">
                <v-text-field v-model="nama" label="Nama" variant="outlined" :readonly="!editable" density="compact"></v-text-field>
                <v-text-field v-model.number="harga" label="Harga" variant="outlined" :readonly="!editable" density="compact"></v-text-field>
                <v-select :items="catItems" label="Kategori" variant="outlined" item-title="name" v-model="kategori" :readonly="!editable" density="compact"></v-select>
                <v-text-field v-model.number="stock" label="Stock" variant="outlined" :readonly="!editable" density="compact"></v-text-field>
                <!-- image container -->
                <div class="d-flex flex-row mb-4 align-center">
                    <img class="w-25" :src="url+'images/'+image" alt="">
                    <v-file-input class="h-4" v-model="selectedImg" label="Image" variant="outlined" accept="image/png, image/jpeg" :disabled="!editable" density="compact"></v-file-input>
                    <v-btn v-if="editable" class="mb-6 ml-4" icon variant="text" color="red">
                        <v-icon>
                            mdi-alert-circle-outline
                        </v-icon>
                    <v-tooltip activator="parent" location="bottom">Gambar harus dalam format JPG/PNG</v-tooltip>
                </v-btn>
                </div>
                <!-- for activate edit -->
                <div v-if="!editable" class="text-center">
                    <v-btn class="text-body-2 text-white mr-8" prepend-icon="mdi-pencil" color="orange-lighten-2" @click="editable=!editable">Edit</v-btn>
                    <v-btn class="text-body-2 text-white" prepend-icon="mdi-close" color="red-lighten-2" @click="deleteProduct()">Delete</v-btn>
                </div>
                <!-- for submit edit -->
                <div v-if="editable"  class="text-center">
                    <v-btn class="text-body-2 text-white mr-8" prepend-icon="mdi-check" color="blue-lighten-2" @click="updateProduct(), editable=!editable">Simpan</v-btn>
                    <v-btn class="text-body-2 text-white" prepend-icon="mdi-close" color="red-lighten-2" @click="editable=!editable">Batal</v-btn>
                </div>
                </v-form>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios';

import { useEnvStore } from '@/store/envStore';
import { useAuthStore } from '@/store/authStore';
export default {
    data() {
        return {
            loading: true,
            editable: false,
            nama: null,
            harga: 0,
            kategori: null,
            stock: 0,
            image: null,
            selectedImg: [],
            catItems: [],
            url: useEnvStore().apiUrl
        }
    },
    methods: {
        async getProduct() {
            try {
                const prod = await axios.get(useEnvStore().apiUrl + 'products/' + this.$route.params.id, {
                    headers: {
                        Authorization: 'Bearer ' + useAuthStore().accessToken
                    }
                })
                const cat = await axios.get(useEnvStore().apiUrl + 'category', {
                    headers: {
                        Authorization: 'Bearer ' + useAuthStore().accessToken
                    }
                })
                console.log(prod)
                this.catItems = cat.data
                this.nama = prod.data.nama
                this.harga = prod.data.harga
                this.kategori = prod.data.kategori
                this.stock = prod.data.stock
                this.image = prod.data.photo
                this.loading = false
            }
            catch (err) {
                console.log(err)
                if (err.response.status === 401) {
                    this.$router.push({ name: 'notfound' })
                }
            }
        },
        updateProduct() {
            this.selectedImg = this.selectedImg[0]
            let upData = new FormData()
            upData.append('nama', this.nama)
            upData.append('harga', this.harga)
            upData.append('img', this.selectedImg)
            upData.append('kategori', this.kategori)
            upData.append('stock', this.stock)
            upData.append('_method', "PUT")
            axios
                .put(useEnvStore().apiUrl + "products/" + this.$route.params.id, upData,{
                    headers:{
                        Authorization:"Bearer "+useAuthStore().accessToken
                    }
                })
                .then((res) => {
                    console.log(res)
                    this.editable = false
                    this.getProduct()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        deleteProduct() {
            axios.delete(useEnvStore().apiUrl + "products/" + this.$route.params.id,{
                    headers:{
                        Authorization:"Bearer "+useAuthStore().accessToken
                    }
                })
                .then((res) => {
                    console.log(res)
                    this.$router.push('/products')
                })
                .catch((err) => {
                    console.log(err)
                })
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
        this.getProduct()
    },
}
</script>
