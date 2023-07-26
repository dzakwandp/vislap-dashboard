<template lang="">
    <div>
        <v-container>
            <v-card class="w-75 mx-auto pa-8">
                <v-card-title class="ml-n4 mb-4 mt-n4">Detail Produk</v-card-title>
                <v-form @submit.prevent="uploadFile" enctype="multipart/form-data">
                <v-text-field v-model="nama" label="Nama" variant="outlined" :readonly="!editable" density="compact"></v-text-field>
                <v-text-field v-model.number="harga" label="Harga" variant="outlined" :readonly="!editable" density="compact"></v-text-field>
                <v-select :items="catItems" label="Kategori" variant="outlined" item-title="name" v-model="kategori" :readonly="!editable" density="compact"></v-select>
                <v-text-field v-model.number="stock" label="Stock" variant="outlined" :readonly="!editable" density="compact"></v-text-field>
                <!-- image container -->
                <div class="d-flex flex-row mb-4 align-center">
                    <img class="w-50" :src="url+'images/'+image" alt="">
                    <v-file-input class="h-4" v-model="selectedImg" label="Image" variant="outlined" accpet="image/*" :disabled="!editable" density="compact"></v-file-input>
                </div>
                <!-- for activate edit -->
                <div v-if="!editable" class="text-center">
                    <v-btn class="text-body-2 text-white mr-8" prepend-icon="mdi-pencil" color="orange-lighten-2" @click="editable=!editable">Edit</v-btn>
                    <v-btn class="text-body-2 text-white" prepend-icon="mdi-close" color="red-lighten-2">Delete</v-btn>
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
export default {
    data() {
        return {
            editable: false,
            nama: null,
            harga: null,
            kategori: null,
            stock: 0,
            image: null,
            selectedImg: null,
            catItems: [],
            url: useEnvStore().apiUrl
        }
    },
    methods: {
        async getProduct() {
            try {
                const prod = await axios.get(useEnvStore().apiUrl + 'products/' + this.$route.params.id)
                const cat = await axios.get(useEnvStore().apiUrl + 'category')
                console.log(prod)
                this.catItems = cat.data
                this.nama = prod.data.nama
                this.harga = prod.data.harga
                this.kategori = prod.data.kategori
                this.stock = prod.data.stock
                this.image = prod.data.photo
            }
            catch (err) {
                console.log(err)
            }
        },
        updateProduct() {
            this.photo = this.selectedImg[0]
            let upData = new FormData()
            upData.append('nama', this.nama)
            upData.append('harga', this.harga)
            upData.append('img', this.photo)
            upData.append('kategori', this.kategori)
            upData.append('stock', this.stock)
            upData.append('_method', "POST")
            axios
                .put(useEnvStore().apiUrl + "products/"+this.$route.params.id, upData)
                .then((res) => {
                    console.log(res)
                    this.getProduct()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    },
    mounted() {
        this.getProduct()
    },
}
</script>