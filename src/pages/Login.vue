<template>
  <v-container>
    <v-snackbar
      :timeout="2000"
      color="error"
      absolute
      right
      top
      outlined
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </v-snackbar>
    <v-container fill-height justify-center align-centerelevation="5">
      <v-flex class="forms">
        <v-tabs>
          <v-tab @click="toggle">Вход</v-tab>
          <v-tab @click="toggle">Регистрация</v-tab>
        </v-tabs>
        <v-form ref="form" lazy-validation v-if="isSignInFormVisible">
          <v-text-field
            v-model="user.email"
            label="Почта"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            label="Пароль"
            required
            type="password"
          ></v-text-field>
          <v-btn @click="login"> Войти </v-btn>
        </v-form>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-if="!isSignInFormVisible"
        >
          <v-text-field
            v-model="user.email"
            label="Почта"
            required
          ></v-text-field>
          <v-text-field v-model="user.name" label="Имя" required></v-text-field>
          <v-text-field
            v-model="user.surname"
            label="Фамилия"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            label="Пароль"
            type="password"
            required
          ></v-text-field>
          <v-btn @click="registration"> Зарегистрироваться </v-btn>
        </v-form>
      </v-flex>
    </v-container>
  </v-container>
</template>

<script>
import { usersModule } from "../store/users";
export default {
  name: "App",
  data: () => ({
    isSignInFormVisible: true,
    user: {
      email: "",
      name: "",
      password: "",
      surname: "",
    },
    errorMessage: "",
  }),
  methods: {
    toggle() {
      this.isSignInFormVisible = !this.isSignInFormVisible;
      this.resetData();
    },
    login() {
      usersModule.login(this.user).then((result) => {
        if (result.data.type) {
          this.errorMessage = result.data.message;
        } else {
          usersModule.setUser(result.data);
          this.$emit("userState");
        }
      });
    },
    registration() {
      usersModule.registration(this.user).then((result) => {
        if (result.data.type) {
          this.errorMessage = result.data.message;
        } else {
          usersModule.setUser({
            ...this.user,
            id: result.data.insertId,
          });
          this.$emit("userState");
        }
      });
    },
    resetData() {
      this.user = {
        email: "",
        name: "",
        surname: "",
        password: "",
      };
    },
  },
};
</script>
<style scoped>
.forms {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  padding: 20px 60px 20px 60px;
}
</style>