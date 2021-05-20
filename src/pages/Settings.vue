<template>
  <div class="project_module">
    <h3>Настройки</h3>
    <v-form ref="form" lazy-validation class="new_role_form">
      <v-text-field
        v-for="setting in settings"
        :key="setting.id"
        v-model="setting.value"
        :label="setting.name"
        type="number"
        class="form_item"
      ></v-text-field>
    </v-form>
    <v-btn color="primary"> Изменить сохранения </v-btn>
  </div>
</template>
<script>
import { settingsModule } from "../store/settings";
export default {
  data() {
    return {
      settings: [],
    };
  },
  created() {
    settingsModule.getSettings().then((response) => {
      this.settings = response.data;
    });
  },
};
</script>
<style scoped>
.new_role_form {
  margin-top: 20px;
}
.form_item {
  width: 50%;
  /* margin: 10px 20px 10px 20px; */
}
.project_module {
  flex-grow: 1;
  padding: 20px;
}
h3 {
  font-size: 25px;
  font-style: italic;
  margin-left: 20px;
  font-weight: 500;
}
.v-btn{
background-color: #1867c0 !important;
}
</style>