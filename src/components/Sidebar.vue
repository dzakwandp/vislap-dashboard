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
            <v-list density="compact" nav>
                    <v-list-item :prepend-icon="links[0].icon" :title="links[0].title" :to="links[0].route" link>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi" subtitle="Penjualan"></v-list-item>
                    <v-list-item :prepend-icon="links[1].icon" :title="links[1].title" :to="links[1].route" link>
                    </v-list-item>
                    <v-list-item v-for="item in penjualan" :prepend-icon="item.icon" :title="item.title" :to="item.route" link>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item prepend-icon="mdi" subtitle="Service"></v-list-item>
                    <v-list-item :prepend-icon="links[2].icon" :title="links[2].title" :to="links[2].route" link>
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
            drawer: true,
            links: [
                { icon: "mdi-home", title: "Home", route: "/home" },
                { icon: "mdi-file-multiple", title: "Penjualan", route: "/penjualan" },
                { icon: "mdi-tools", title: "Service", route: "/service" }
            ],
            penjualan: [
                { icon: "mdi-shape", title: "Kategori", route: "/kategori" },
                { icon: "mdi-treasure-chest", title: "Produk", route: "/produk" }
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