<template lang="">
  <div>
    <!-- home for admin -->
    <v-container v-if="role === 2">
      <v-card class="mb-4" color="blue-darken-2">
        <v-card-title> Total Transaksi <v-icon>mdi-cash</v-icon> </v-card-title>
        <v-progress-linear
          v-if="transLoad"
          :indeterminate="true"
          color="blue-darken-4"
        ></v-progress-linear>
        <v-card-title v-else>
          {{ transData.length }}
        </v-card-title>
      </v-card>
      <v-card class="text-white mb-4" color="orange darken-2">
        <v-card-title> Total Service <v-icon>mdi-tools</v-icon> </v-card-title>
        <v-progress-linear
          v-if="serviceLoad"
          :indeterminate="true"
          color="orange-darken-4"
        ></v-progress-linear>
        <v-card-title v-else>
          {{ serviceData.length }}
        </v-card-title>
      </v-card>
      <v-card color="green-darken-1">
        <v-card-title>
          Barang hampir habis
          <v-btn
            class="ml-4 text-body-2"
            variant="outlined"
            @click="this.$router.push('/products')"
            >Manage</v-btn
          ></v-card-title
        >
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title color="green-darken-1">
              Show
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table class="text-body-2">
                <thead>
                  <tr>
                    <th>Barang</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody v-for="item in productData">
                  <tr v-if="item.stock < 10">
                    <td>{{ item.nama }}</td>
                    <td>{{ item.stock }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-container>
    <!-- home for technician -->
    <v-container v-if="role === 3">
      <v-card color="green-darken-1">
        <v-card-title>
          Incoming Service
          <v-btn
            class="ml-4 text-body-2"
            variant="outlined"
            @click="this.$router.push('/service_tech')"
            >Manage</v-btn
          ></v-card-title
        >
        <v-table class="text-body-2">
          <thead>
            <tr>
              <th>User</th>
              <th>Whatsapp User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody v-for="item in serviceTech">
            <tr v-if="item.message2 === null">
              <td>{{ item.user.name }}</td>
              <td>{{ item.wa_user }}</td>
              <td>{{ item.service_status.status_name }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import { useEnvStore } from "@/store/envStore";
export default {
  data() {
    return {
      role: useAuthStore().getRole,
      transData: [],
      serviceData: [],
      productData: [],
      serviceTech: [],
      transLoad: true,
      serviceLoad: true,
    };
  },
  methods: {
    async getTrans() {
      try {
        const trans = await axios.get(useEnvStore().apiUrl + "txs", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        this.transData = trans.data;
        this.transLoad = false;
      } catch (err) {
        console.log(err);
      }
    },
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
        this.serviceData = service.data;
        this.serviceLoad = false;
      } catch (err) {
        console.log(err);
      }
    },
    async getServiceTech() {
      try {
        const serv = await axios.get(
          useEnvStore().apiUrl + "services/technician",
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(serv);
        this.serviceTech = serv.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getProduct() {
      try {
        const prod = await axios.get(useEnvStore().apiUrl + "products", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        this.productData = prod.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    if (this.role === 2) {
      this.getService();
      this.getTrans();
      this.getProduct();
    }
    if (this.role === 3) {
      this.getServiceTech();
    }
  },
};
</script>
<style lang=""></style>
