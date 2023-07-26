<template lang="">
    <div>
      <v-container class="w-50">
        <v-form @submit.prevent="uploadFile" enctype="multipart/form-data">
        <v-text-field label="Nama" v-model="nama"></v-text-field>
        <v-text-field label="Harga" type="number" v-model.number="harga"></v-text-field>
        <v-file-input label="Photo" v-model="photo" accpet="image/*"></v-file-input>
        <v-text-field label="Kategori" v-model="kategori"></v-text-field>
        <v-text-field label="Stock" type="number" v-model.number="stock"></v-text-field>
        <v-btn @click="uploadFile">Submit</v-btn>
      </v-form>
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
        image: null
      }
    },
    methods: {
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
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // async uploadImage() {
      //   console.log(this.image)
      //   const file = this.image[0]
      //   this.image = file
      //   const imageData = new FormData();
      //   imageData.append('img', this.image)
      //   try {
      //     const imagUp = await axios.post(useEnvStore().apiUrl + "products/single", imageData)
      //     console.log(imagUp)
      //   }
      //   catch (err) {
      //     console.log(err)
      //   }
      // }
    },
  }
  </script>
  <style lang="">
    
  </style>