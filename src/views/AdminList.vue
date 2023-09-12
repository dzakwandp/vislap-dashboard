<template lang="">
  <div>
    <v-container>
      <v-btn
        class="text-body-2 mb-4"
        color="blue-darken-3"
        prepend-icon="mdi-plus"
        @click="dialogAdd = true"
      >
        Tambah Admin
        <v-dialog v-model="dialogAdd">
          <v-card class="w-25 pa-4 mx-auto">
            <v-card-title>Tambah Akun Admin</v-card-title>
            <v-text-field
              v-model="name"
              variant="outlined"
              density="compact"
              label="Name"
            ></v-text-field>
            <v-text-field
              v-model="email"
              variant="outlined"
              density="compact"
              label="Email"
            ></v-text-field>
            <v-text-field
              v-model="pass"
              variant="outlined"
              density="compact"
              label="Password"
            ></v-text-field>
            <v-text-field
              v-model="conpass"
              variant="outlined"
              density="compact"
              label="Confirm Password"
            ></v-text-field>
            <v-btn
              class="text-body-2 mt-2"
              color="blue-darken-3"
              @click="createAdmin()"
              :loading="loadingAdd"
              >Tambahkan</v-btn
            >
            <div class="text-center">
              <p class="text-red text-caption">{{ alert }}</p>
            </div>
          </v-card>
        </v-dialog>
      </v-btn>
      <EasyDataTable
        :headers="dataHeader"
        :items="admins"
        :loading="loading"
        theme-color="#1565C0"
      >
        <template #item-role="item">
          {{ getRole(item.role) }}
        </template>
        <template #item-opsi="item">
          <v-btn
            prepend-icon="mdi-close"
            size="small"
            color="red"
            @click="(idToDel = item.id), (dialogDel = true)"
            >Hapus
            <v-dialog class="w-25" v-model="dialogDel">
              <v-sheet class="pa-4">
                <v-btn
                  location="right top"
                  position="absolute"
                  color="red"
                  variant="plain"
                  size="large"
                  :ripple="false"
                  @click="dialogDel = false"
                >
                  <v-icon>mdi-close-circle </v-icon>
                </v-btn>
                <v-card-title> Apakah Anda yakin? </v-card-title>
                <v-card-text> Tuliskan "Saya Yakin" </v-card-text>
                <v-text-field
                  label="Tulis disini"
                  v-model="key"
                  variant="outlined"
                  density="compact"
                  color="red"
                ></v-text-field>
                <v-card-actions>
                  <v-btn
                    class="mx-auto"
                    variant="tonal"
                    color="red"
                    :loading="loadingDel"
                    @click="(loadingDel = true), deleteAccount()"
                    >Hapus</v-btn
                  >
                </v-card-actions>
              </v-sheet>
            </v-dialog>
          </v-btn>
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
      roleLoggedIn: useAuthStore().getRole,
      loading: true,
      name: null,
      email: null,
      pass: null,
      conpass: null,
      roleToAdd: null,
      alert: null,
      dialogAdd: false,
      loadingAdd: false,
      dialogDel: false,
      loadingDel: false,
      idToDel: null,
      key: null,
      admins: [],
      dataHeader: [
        { text: "id", value: "id" },
        { text: "Nama", value: "name" },
        { text: "Email", value: "email" },
        { text: "Role", value: "role" },
        { text: "", value: "opsi", sortable: false },
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
    async getAdmins() {
      try {
        const admins = await axios.get(useEnvStore().apiUrl + "admins", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(admins);
        this.admins = admins.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          this.$router.push({ name: "notfound" });
        }
      }
    },
    async createAdmin() {
      this.loadingAdd = true;
      if (this.pass === this.conpass) {
        this.alert = null;
        switch (this.roleLoggedIn) {
          case 1:
            this.roleToAdd = 2;
            break;
          case 2:
            this.roleToAdd = 3;
            break;
        }
        try {
          const create = await axios.post(
            useEnvStore().apiUrl + "admins/registers",
            {
              name: this.name,
              email: this.email,
              password: this.pass,
              confirm_password: this.conpass,
              role: this.roleToAdd,
            },
            {
              headers: {
                Authorization: "Bearer " + useAuthStore().accessToken,
              },
            }
          );
          console.log(create);
          this.Toast.fire({
            text: "Berhasil dibuat",
            icon: "success",
            iconColor: "#FAFAFA",
            color: "#FAFAFA",
            background: "#1565C0",
          });
          this.dialogAdd = false;
          this.loadingAdd = false;
          this.getAdmins();
        } catch (err) {
          console.log(err);
        }
      } else {
        this.alert = "Password doesn't match";
        this.loadingAdd = false;
      }
    },
    async deleteAccount() {
      if (this.key === "Saya Yakin") {
        try {
          const del = await axios.delete(
            useEnvStore().apiUrl + "admins/account/" + this.idToDel,
            {
              headers: {
                Authorization: "Bearer " + useAuthStore().accessToken,
              },
            }
          );
          console.log(del)
          this.Toast.fire({
            text: "Berhasil dihapus",
            icon: "success",
            iconColor: "#FAFAFA",
            color: "#FAFAFA",
            background: "#E57373",
          });
          this.dialogDel = false;
          this.getAdmins();
        } catch (err) {
          console.log(err);
        }
      } else {
        this.loadingDel = false;
        this.dialogDel = false;
        this.Toast.fire({
          text: "Keyword salah!",
          icon: "warning",
          iconColor: "#FAFAFA",
          color: "#FAFAFA",
          background: "#E57373",
        });
      }
    },
    getRole(id) {
      switch (id) {
        case 2:
          return "Admin";
        case 3:
          return "Teknisi";
      }
    },
  },
  mounted() {
    this.getAdmins();
  },
};
</script>
<style lang=""></style>
