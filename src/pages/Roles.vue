<template>
  <div class="project_module">
    <h3>Роли</h3>
    <v-form ref="form" lazy-validation class="new_role_form">
      <v-text-field
        v-model="roleName"
        label="Роль"
        class="form_item"
      ></v-text-field>
      <v-text-field
        v-model="salary"
        label="Месячная ставка, BYN"
        class="form_item"
      ></v-text-field>
      <v-icon @click="addItem()" size="25" class="form_item">
        mdi-check
      </v-icon>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="roles"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:item.salary="{ item }">
        <v-text-field label="" :value="item.salary" disabled></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-close </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { rolesModule } from "../store/roles";
export default {
  data() {
    return {
      headers: [
        {
          text: "Роль",
          align: "start",
          value: "name",
        },
        { text: "Месячная ставка, BYN", value: "salary" },
        { text: "", value: "actions", sortable: false },
      ],
      selected: [],
      roles: [],
      salary: 0,
      roleName: "",
    };
  },
  created() {
    rolesModule.getRoles().then((result) => {
      console.log(result.data);
      this.roles = result.data;
    });
  },
  methods: {
    addItem() {
      const id = this.roles[this.roles.length - 1]?.id + 1 || 1;
      const newItem = {
        id,
        name: this.roleName,
        salary: this.salary,
      };
      this.roles.push(newItem);
      this.salary = 0;
      this.roleName = '';
      rolesModule.addRole(newItem);
    },
    deleteItem(item) {
      this.roles = this.roles.filter((arrayItem) => arrayItem.id !== item.id);
      rolesModule.deleteRole(item.id);
    },
  },
};
</script>
<style scoped>
.new_role_form {
  display: flex;
}
.form_item {
  margin: 10px 20px 10px 20px;
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
</style>