<template>
  <div class="flex_container">
    <div class="flex_element" v-if="isUserLogin">
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
        class="blue lighten-5"
        mini-variant-width="70"
        width="250"
        light
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-title>{{
            user.name + " " + user.surname
          }}</v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="handleUserActions(item)"
            router
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
    <div class="flex_element router_element" v-if="!isUserLogin">
      <Login @userState="userStateChanged"></Login>
    </div>
    <router-view />
  </div>
</template>

<script>
import Login from "./pages/Login";
import { usersModule } from "./store/users";
export default {
  components: { Login },
  data() {
    return {
      drawer: true,
      items: [
        { title: "Проекты", icon: "mdi-book", link: "projects" },
        { title: "Роли", icon: "mdi-account", link: "roles" },
        { title: "Настройки", icon: "mdi-book-open-page-variant", link: "settings" },
        {
          title: "Выйти",
          icon: "mdi-logout-variant",
          link: "",
        },
      ],
      mini: true,
      isUserLogin: false,
      user: null,
    };
  },
  created() {
    this.isUserLogin = !!usersModule.getUser();
    this.user = usersModule.getUser();
    if (this.isUserLogin) {
      this.$router.push("/projects");
    }
    window.Statuses = {
      1: "Черновик",
      2: "В прогрессе",
      3: "Завершен",
    };
  },
  methods: {
    userStateChanged() {
      this.isUserLogin = !!usersModule.getUser();
      this.user = usersModule.getUser();
      this.$router.push("/projects");
    },
    logout() {
      window.localStorage.removeItem("user");
      this.isUserLogin = !!usersModule.getUser();
      this.$router.push("/");
    },
    handleUserActions(item) {
      if (item.link) {
        this.$router.push(`/${item.link}`);
      } else {
        this.logout();
      }
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  height: 100vh !important;
}
.v-list-item__title {
  margin-left: 15px;
}
.flex_container {
  display: flex;
}
.flex_element {
  display: inline-block;
}
.router_element {
  flex-grow: 1;
}
</style>