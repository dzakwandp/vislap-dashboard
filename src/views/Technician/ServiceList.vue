<template lang="">
  <div>
    <v-container>
      <EasyDataTable
        :items="serviceList"
        :headers="dataHeader"
        :loading="loading"
        theme-color="#1565C0"
      >
        <template #item-opsi="item">
          <!-- popup untuk melakukan accept service -->
          <v-btn
            v-if="item.status_id === 1"
            class="ma-2"
            color="blue-darken-3"
            size="small"
            prepend-icon="mdi-check"
            @click="
              (dialogProc = true), (serviceId = item.id), loadServiceById()
            "
            >Accept
            <v-dialog v-model="dialogProc">
              <v-card class="w-50 mx-auto">
                <v-card-title class="text-blue-darken-3">
                  Informasi Service
                  <v-card class="mb-4">
                    <v-card-title> Message from User </v-card-title>
                    <v-card-text>
                      {{ serviceDataById.message1 }}
                    </v-card-text>
                  </v-card>
                </v-card-title>
                <v-card-title class="text-blue-darken-3">
                  Konfirmasi (Diagnosa Awal)
                </v-card-title>
                <v-textarea
                  class="mx-4"
                  v-model="message2"
                  auto-grow
                  label="Diagnosa"
                  placeholder="Tuliskan diagnosa awal"
                  variant="outlined"
                >
                </v-textarea>
                <v-card-actions>
                  <v-btn
                    class="mx-auto text-body-2"
                    variant="outlined"
                    color="blue-darken-3"
                    :loading="loadingButton"
                    @click="(loadingButton = true), acceptService()"
                    >Accept</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
          <!-- popup untuk menyelesaikan service -->
          <v-btn
            v-if="item.status_id === 2"
            class="ma-2"
            size="small"
            color="green-darken-3"
            prepend-icon="mdi-check"
            @click="
              (dialogFin = true), (serviceId = item.id), loadServiceById()
            "
            >Finish
            <v-dialog v-model="dialogFin">
              <v-card class="w-50 mx-auto">
                <v-card-title class="text-blue-darken-3">
                  Informasi Service
                  <v-card class="mb-4">
                    <v-card-title> Message from User </v-card-title>
                    <v-card-text>
                      {{ serviceDataById.message1 }}
                    </v-card-text>
                  </v-card>
                  <v-card class="mb-4">
                    <v-card-title> First Technician Diagnosis </v-card-title>
                    <v-card-text>
                      {{ serviceDataById.message2 }}
                    </v-card-text>
                  </v-card>
                </v-card-title>
                <v-card-title class="text-blue-darken-3">
                  Selesaikan Service
                </v-card-title>
                <v-textarea
                  class="mx-4"
                  v-model="message3"
                  auto-grow
                  label="Message (optional)"
                  variant="outlined"
                >
                </v-textarea>
                <v-text-field
                  class="mx-4"
                  v-model.number="price"
                  label="Harga"
                  variant="outlined"
                ></v-text-field>
                <v-card-actions>
                  <v-btn
                    class="mx-auto text-body-2"
                    variant="outlined"
                    color="blue-darken-3"
                    :loading="loadingButton"
                    @click="(loadingButton = true), finishService()"
                    >Selesaikan</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
          <v-btn
            class="ma-2"
            size="small"
            color="blue-darken-3"
            prepend-icon="mdi-eye"
            @click="this.$router.push('/service_detail/' + item.id)"
            >Details</v-btn
          >
        </template>
      </EasyDataTable>
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
      message2: "",
      message3: "",
      price: null,
      serviceId: null,
      dialogProc: false,
      dialogFin: false,
      loadingButton: false,
      serviceList: [],
      serviceDataById: [],
      dataHeader: [
        { text: "id", value: "id" },
        { text: "Date", value: "date" },
        { text: "User", value: "user.name" },
        { text: "WA User", value: "wa_user" },
        { text: "Status", value: "service_status.status_name" },
        { text: "", value: "opsi", sortable: false },
      ],
    };
  },
  methods: {
    async getServiceList() {
      try {
        const service = await axios.get(
          useEnvStore().apiUrl + "services/technician",
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
    async loadServiceById() {
      try {
        const service = await axios.get(
          useEnvStore().apiUrl + "services/" + this.serviceId,
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(service);
        this.serviceDataById = service.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          this.$router.push({ name: "notfound" });
        }
      }
    },
    async acceptService() {
      try {
        const accept = await axios.put(
          useEnvStore().apiUrl + "services/technician/" + this.serviceId,
          {
            message2: this.message2,
            message3: "",
            status_id: 2,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(accept);
        this.dialogProc = false;
        this.$swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          text: "Berhasil terima servis ",
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
        this.getServiceList();
      } catch (err) {
        console.log(err);
      }
    },
    async finishService() {
      try {
        const finish = await axios.put(
          useEnvStore().apiUrl + "services/technician/" + this.serviceId,
          {
            message2: this.serviceDataById.message2,
            message3: this.message3,
            price: this.price,
            status_id: 3,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(finish);
        this.dialogFin = false;
        this.$swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          text: "Berhasil menyelesaikan servis ",
          icon: "success",
          iconColor: "#FAFAFA",
          color: "#FAFAFA",
          background: "#1565C0",
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", this.$swal.stopTimer);
            toast.addEventListener("mouseleave", this.$swal.resumeTimer);
          },
        });
        this.getServiceList();
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getServiceList();
  },
};
</script>
<style lang=""></style>
