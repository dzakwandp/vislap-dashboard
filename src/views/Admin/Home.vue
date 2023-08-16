<template lang="">
  <div>
      <p>This is home</p>
  </div>
</template>
<script>
import axios from 'axios';

import { useAuthStore } from '@/store/authStore';
import { useEnvStore } from '@/store/envStore';
export default {
  methods: {
    async getAdminInfo(){
      try{
        const profile=await axios.get(useEnvStore().apiUrl+'admins/profile',{
          headers:{
            Authorization:'Bearer '+useAuthStore().accessToken
          }
        })
        console.log(profile)
      }
      catch(err){
        console.log(err)
      }
    }
  },
}
</script>
<style lang="">
  
</style>