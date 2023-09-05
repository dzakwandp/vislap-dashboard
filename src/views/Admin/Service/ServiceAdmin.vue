<template lang="">
  <div>
    <v-container>
      <EasyDataTable
        :headers="dataHeader"
        :items="serviceList"
        :loading="loading"
        theme-color="#1565C0"
      >
        <template #item-price="item">
          {{ formatCurrency(item.price) }}
        </template>
        <template #item-opsi="item">
          <v-btn
            v-if="item.technician_id === null"
            class="ma-2 text-white"
            color="orange"
            prepend-icon="mdi-tools"
            size="small"
            @click="(dialogSet = true), (serviceId = item.id)"
            >Assign
            <v-dialog v-model="dialogSet">
              <v-card class="mx-auto w-25 pa-4">
                <v-card-title>Pilih Teknisi</v-card-title>
                <v-select
                  v-model="selectedTech"
                  label="Teknisi"
                  :items="tech"
                  item-title="name"
                  density="compact"
                  return-object
                ></v-select>
                <v-btn
                  class="ma-2 text-white"
                  color="orange"
                  prepend-icon="mdi-tools"
                  size="small"
                  :loading="loadingButton"
                  @click="(loadingButton = true), setTech()"
                  >Assign</v-btn
                >
              </v-card>
            </v-dialog>
          </v-btn>
          <v-btn
            class="ma-2"
            size="small"
            color="blue-darken-3"
            prepend-icon="mdi-eye"
            @click="toServiceDetail(item.id)"
            >Details</v-btn
          >
        </template></EasyDataTable
      >
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import { useEnvStore } from "@/store/envStore";
export default {
  components: {
    EasyDataTable: window["vue3-easy-data-table"],
  },
  data() {
    return {
      loading: true,
      loadingButton: false,
      dialogSet: false,
      serviceId: null,
      selectedTech: null,
      tech: [],
      serviceList: [],
      dataHeader: [
        { text: "id", value: "id" },
        { text: "Date", value: "date" },
        { text: "Technician", value: "technician.name" },
        { text: "WA User", value: "wa_user" },
        { text: "Status", value: "service_status.status_name" },
        { text: "Harga", value: "price" },
        { text: "", value: "opsi", sortable: false },
      ],
    };
  },
  methods: {
    async getService() {
      try {
        const service = await axios.get(
          useEnvStore().apiUrl + "services/admin",
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(service);
        this.serviceList = service.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          this.$router.push({ name: "notfound" });
        }
      }
    },
    async getAdmins() {
      try {
        const admins = await axios.get(useEnvStore().apiUrl + "admins", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(admins);
        this.tech = admins.data;
      } catch (err) {
        console.log(err);
      }
    },
    async setTech() {
      try {
        const set = await axios.put(
          useEnvStore().apiUrl + "services/" + this.serviceId,
          {
            technician_id: parseInt(this.selectedTech.id),
            status_id: 1,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        this.$swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          text: "Berhasil assign ke teknisi: " + this.selectedTech.name,
          icon: "success",
          iconColor: "#FAFAFA",
          color: "#FAFAFA",
          background: "#1565C0",
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", this.$swal.stopTimer);
            toast.addEventListener("mouseleave", this.$swal.resumeTimer);
          },
        });
        this.loadingButton = false;
        this.dialogSet = false;
        this.getService();
      } catch (err) {
        console.log(err);
      }
    },
    toServiceDetail(id) {
      this.$router.push("/service_detail/" + id);
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
  },
  mounted() {
    this.getService(), this.getAdmins();
  },
};
</script>
<style lang=""></style>
