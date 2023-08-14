<template lang="">
    <div>
      <v-container class="w-50">
        <div>
            <v-btn class="mb-4 text-body-2" variant="text" prepend-icon="mdi-arrow-left" color="grey-darken-1" @click="this.$router.push('/products')">Kembali</v-btn>
        </div>
        <v-card class="pa-8">
          <v-card-title class="ml-n4 mb-4">Tambah Produk</v-card-title>
          <v-form @submit.prevent="uploadFile" enctype="multipart/form-data">
          <v-text-field label="Nama" v-model="nama" variant="outlined" density="compact"></v-text-field>
          <v-text-field label="Harga" type="number" v-model.number="harga" variant="outlined" density="compact"></v-text-field>
          <v-file-input label="Photo" v-model="photo" accpet="image/*" variant="outlined" density="compact"></v-file-input>
          <v-select :items="catItems" label="Kategori" variant="outlined" item-title="name" v-model="kategori" density="compact"></v-select>
          <v-text-field label="Stock" type="number" v-model.number="stock" variant="outlined" density="compact"></v-text-field>
          <v-btn class="mt-4 text-body-2" color="blue-darken-2" location="center" @click="uploadFile">Submit</v-btn>
        </v-form>
        </v-card>
      </v-container>
    </div>
  </template>
<script>
import { useEnvStore } from '@/store/envStore';

import axios from "axios"
export default {
  data() {
    return {
      nama: null,
      harga: 0,
      photo: null,
      kategori: null,
      stock: 0,
      catItems: [],
      image: null
    }
  },
  methods: {
    async getCategory() {
      try {
        const cat = await axios.get(useEnvStore().apiUrl + 'category')
        this.catItems = cat.data
        console.log(this.catItems)
      }
      catch(err){
        console.log(err)
      }
    },
    uploadFile() {
      this.photo = this.photo[0]
      let newData = new FormData()
      newData.append('nama', this.nama)
      newData.append('harga', this.harga)
      newData.append('img', this.photo)
      newData.append('kategori', this.kategori)
      newData.append('stock', this.stock)
      newData.append('_method', "POST")
      axios
        .post(useEnvStore().apiUrl + "products/", newData)
        .then((res) => {
          console.log(res)
          this.$router.push('/products')
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  mounted() {
    this.getCategory()
  },
}
</script>
<style lang="">
    
  </style>