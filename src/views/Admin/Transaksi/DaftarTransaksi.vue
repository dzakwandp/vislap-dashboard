<template lang="">
  <div>
    <v-container>
      <v-text-field
        class="w-25 ml-auto"
        v-model="search"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        placeholder="Search by service id"
      ></v-text-field>
      <EasyDataTable
        :loading="loading"
        :headers="tableHeader"
        :items="reversedTx"
        :search-field="field"
        :search-value="search"
        theme-color="#1565C0"
      >
        <template #item-date="item">
          {{ formattedDate(item.date) }}
        </template>
        <template #item-final_price="item">
          {{ formatCurrency(item.final_price) }}
        </template>
        <template #item-details="item" v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            color="blue-darken-3"
            variant="text"
            @click="toTxDetail(item.id)"
          ></v-btn>
        </template>
      </EasyDataTable>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

import { useEnvStore } from "@/store/envStore";
import { useAuthStore } from "@/store/authStore";
import moment from "moment/min/moment-with-locales";
export default {
  components: {
    EasyDataTable: window["vue3-easy-data-table"],
  },
  data() {
    return {
      loading: true,
      search: "",
      field: "id",
      tableHeader: [
        { text: "id", value: "id" },
        { text: "Tanggal", value: "date" },
        { text: "Total Invoice", value: "final_price" },
        { text: "Status", value: "status.status" },
        { text: "", value: "details" },
      ],
      txData: [],
    };
  },
  computed: {
    reversedTx(){
        return this.txData.slice().reverse()
    }
  },
  methods: {
    async getTxsData() {
      try {
        const txs = await axios.get(useEnvStore().apiUrl + "txs", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(txs);
        this.txData = txs.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          this.$router.push({ name: "notfound" });
        }
      }
    },
    toTxDetail(id) {
      this.$router.push("/txs/" + id);
    },
    formattedDate(value) {
      moment.locale("id");
      return moment(value).format("D MMMM YYYY [Jam] HH:mm:s");
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
    this.getTxsData();
  },
};
</script>
