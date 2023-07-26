<template>
    <nav>
        <v-app-bar :elevation="0" color="white" border>
            <v-toolbar-title>
                <v-img src="@/assets/vislap_logo.png" :width="50"></v-img>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="red-darken-1" @click="logOut()">
                <span>Log Out</span>
                <v-icon right>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer expand-on-hover rail color="grey-darken-3" class="text-indigo-lighten-4">
            <v-list>
                <v-list-item :prepend-avatar="userData.setPicture" :title="userData.setName"
                    :subtitle="userData.setEmail"></v-list-item>
            </v-list>

            <v-divider></v-divider>
            <v-list v-if="role === 1" density="compact" nav>
                <v-list-item v-for="item in superlinks" :prepend-icon="item.icon" :title="item.title" :to="item.route"
                    link>
                </v-list-item>
            </v-list>
            <v-list v-else-if="role === 2" density="compact" nav>
                <v-list-item :prepend-icon="adminlinks[0].icon" :title="adminlinks[0].title" :to="adminlinks[0].route" link>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item prepend-icon="mdi" subtitle="Penjualan"></v-list-item>
                <v-list-item :prepend-icon="adminlinks[1].icon" :title="adminlinks[1].title" :to="adminlinks[1].route" link>
                </v-list-item>
                <v-list-item v-for="item in adminpenjualan" :prepend-icon="item.icon" :title="item.title" :to="item.route"
                    link>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item prepend-icon="mdi" subtitle="Service"></v-list-item>
                <v-list-item :prepend-icon="adminlinks[2].icon" :title="adminlinks[2].title" :to="adminlinks[2].route" link>
                </v-list-item>
            </v-list>
            <v-list v-if="role === 3" density="compact" nav>
                <v-list-item v-for="item in teknislinks" :prepend-icon="item.icon" :title="item.title" :to="item.route"
                    link>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import { useAuthStore } from '@/store/authStore';
export default {
    setup() {
        const userData = useAuthStore()
        return { userData }
    },
    data() {
        return {
            role: 2,
            drawer: true,
            adminlinks: [
                { icon: "mdi-home", title: "Home", route: "/home" },
                { icon: "mdi-file-multiple", title: "Penjualan", route: "/penjualan" },
                { icon: "mdi-tools", title: "Service", route: "/service" }
            ],
            adminpenjualan: [
                { icon: "mdi-shape", title: "Kategori", route: "/category" },
                { icon: "mdi-treasure-chest", title: "Produk", route: "/products" }
            ],
            superlinks: [
                { icon: "mdi-home", title: "Home", route: "/admin_acc" },
                { icon: "mdi-home", title: "Admin Account", route: "/admin_acc" },
                { icon: "mdi-file-multiple", title: "Laporan", route: "/laporan" },
            ],
            teknislinks:[
            { icon: "mdi-home", title: "Home", route: "/admin_acc" },
            { icon: "mdi-home", title: "Kelola Service", route: "/admin_acc" },
            { icon: "mdi-home", title: "History Service", route: "/admin_acc" },
            ]
        }
    },
    methods: {
        logOut() {
            // const authStore = useAuthStore()
            // authStore.logout()
            this.$router.push('/login')
        }
    },
}
</script>