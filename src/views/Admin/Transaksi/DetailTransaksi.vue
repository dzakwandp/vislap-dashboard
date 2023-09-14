<template lang="">
  <div class="h-screen mx-auto text-center" v-if="loading">
    <v-progress-circular
      class="mt-16"
      :size="128"
      :width="12"
      color="blue-darken-3"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else>
    <v-container class="w-75">
      <v-btn
        color="blue-darken-3"
        prepend-icon="mdi-arrow-left"
        variant="text"
        @click="this.$router.push('/txs')"
        >Back</v-btn
      >
      <v-card class="px-4">
        <v-card-title class="text-center">Detail Transaksi</v-card-title>
        <v-card-text>
          <div class="mt-4 w-50">
            <v-row>
              <v-col class="py-0"> Nomor Transaksi </v-col>
              <v-col class="py-0"> : {{ txsData.id }} </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0"> Tanggal </v-col>
              <v-col class="py-0"> : {{ txsData.date }} </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0"> No. Resi </v-col>
              <v-col class="py-0"> : {{ txsData.resi }} </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-table class="pa-4">
          <thead>
            <tr>
              <th class="text-left">Nama Produk</th>
              <th class="text-left">Jumlah</th>
              <th class="text-left">Harga (pcs)</th>
              <th class="text-left">Total Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in txsData.items" :key="item.index">
              <td>{{ item.product_name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ formatCurrency(item.total_price) }}</td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex">
          <div class="mt-4 mb-8 ml-4 w-50">
            <v-row>
              <v-col cols="3" class="py-0"> Total Bayar </v-col>
              <v-col class="py-0">
                : {{ formatCurrency(txsData.final_price) }}
              </v-col>
            </v-row>
          </div>
          <div class="mt-4 mb-8 w-50">
            <v-row>
              <v-col cols="2" class="pa-0"> Pembeli </v-col>
              <v-col cols="auto" class="pa-0 mr-1"> : </v-col>
              <v-col class="pa-0">{{ txsData.user.name }} </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="pa-0"> Email </v-col>
              <v-col cols="auto" class="pa-0 mr-1"> : </v-col>
              <v-col class="pa-0">{{ txsData.user.email }} </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="pa-0"> Alamat </v-col>
              <v-col cols="auto" class="pa-0 mr-1"> : </v-col>
              <v-col class="pa-0">{{ txsData.alamat }} </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="pa-0 mr-2"></v-col>
              <v-col class="pa-0">{{ txsData.user.kode_pos }}</v-col>
            </v-row>
          </div>
        </div>
        <v-card-title class="text-center">Status Transaksi</v-card-title>
        <v-card-text>
          <v-timeline class="mb-4" direction="horizontal">
            <v-timeline-item
              v-for="list in transStatus"
              :key="list.index"
              :dot-color="getStatusColor(list.id)"
              size="small"
            >
              {{ list.status }}
            </v-timeline-item>
          </v-timeline>
          <div class="text-center">
            <!-- status Menunggu Pembayaran -->
            <div v-if="txsData.status_id === 1">
              <v-btn class="mt-4" color="red" @click="updateTrans(5)"
                >Batalkan Transaksi</v-btn
              >
            </div>
            <!-- status Pembayaran Diterima -->
            <div v-if="txsData.status_id === 2">
              <v-btn
                class="mt-4"
                color="blue-darken-3"
                @click="dialogResi = true"
                :loading="loadingButton"
              >
                Konfirmasi Pengiriman
                <v-dialog
                  v-model="dialogResi"
                  max-width="500px"
                  transition="dialog-transition"
                >
                  <v-sheet class="pa-4">
                    <v-text-field
                      v-model="noResi"
                      label="Masukkan No. Resi"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                    <v-btn
                      location="bottom"
                      outline
                      color="blue-darken-3"
                      :loading="loadingResi"
                      @click="(loadingResi = true), updateTrans(3)"
                      >Konfirmasi</v-btn
                    >
                  </v-sheet>
                </v-dialog>
              </v-btn>
              <v-btn
                class="mt-4 ml-8"
                color="red"
                :loading="loadingButton"
                @click="(loadingButton = true), updateTrans(6)"
                >Refund</v-btn
              >
            </div>
            <!-- Status Transaksi Selesai -->
            <v-btn
              v-if="txsData.status_id === 4"
              class="mt-4"
              color="blue-darken-3"
              disabled
              >Transaksi Selesai</v-btn
            >
            <!-- Status Transaksi Dibatalkan -->
            <v-btn
              v-if="txsData.status_id === 5"
              class="mt-4"
              color="red-darken-3"
              disabled
              >Transaksi Dibatalkan</v-btn
            >
            <!-- status Transaksi Refund -->
            <v-btn
              v-if="txsData.status_id === 6"
              class="mt-4"
              color="red-darken-3"
              disabled
              >Refund</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

import { useEnvStore } from "@/store/envStore";
import { useAuthStore } from "@/store/authStore";
export default {
  data() {
    return {
      dialogResi: false,
      noResi: null,
      loading: true,
      loadingButton: false,
      loadingResi: false,
      txStatusId: null,
      txsData: [],
      transStatus: [
        { id: 5, status: "Dibatalkan" },
        { id: 6, status: "Refund" },
        { id: 1, status: "Menunggu Pembayaran" },
        { id: 2, status: "Pembayaran Diterima" },
        { id: 3, status: "Barang Dikirim" },
        { id: 4, status: "Transaksi Selesai" },
      ],
      Toast: this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      }),
    };
  },
  methods: {
    async loadTxs() {
      try {
        const txs = await axios.get(
          useEnvStore().apiUrl + "txs/" + this.$route.params.id,
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(txs);
        this.txsData = txs.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          this.$router.push({ name: "notfound" });
        }
      }
    },
    updateTrans(status) {
      if (status === 3) {
        axios
          .put(
            useEnvStore().apiUrl + "txs/" + this.$route.params.id,
            {
              status_id: status,
              resi: this.noResi,
            },
            {
              headers: {
                Authorization: "Bearer " + useAuthStore().accessToken,
              },
            }
          )
          .then((res) => {
            console.log(res);
            this.Toast.fire({
              text: "Status berhasil diupdate",
              icon: "success",
              iconColor: "#FAFAFA",
              color: "#FAFAFA",
              background: "#1565C0",
            });
            this.loadingResi = false;
            this.dialogResi = false;
            this.loadTxs();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .put(
            useEnvStore().apiUrl + "txs/" + this.$route.params.id,
            {
              status_id: status,
            },
            {
              headers: {
                Authorization: "Bearer " + useAuthStore().accessToken,
              },
            }
          )
          .then((res) => {
            console.log(res);
            this.Toast.fire({
              text: "Status berhasil diupdate",
              icon: "success",
              iconColor: "#FAFAFA",
              color: "#FAFAFA",
              background: "#1565C0",
            });
            this.loadingButton = false;
            this.loadTxs();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getStatusColor(listId) {
      if (listId === this.txsData.status_id) {
        if (this.txsData.status_id === 5 || this.txsData.status_id === 6) {
          return "red";
        } else {
          return "green";
        }
      } else {
        return "grey";
      }
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
    this.loadTxs();
  },
};
</script>
