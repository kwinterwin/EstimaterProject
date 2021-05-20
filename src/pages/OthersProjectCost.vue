<template>
  <div>
    <v-form ref="form" lazy-validation class="new_other_form">
      <v-text-field
        v-model="name"
        label="Название, описание"
        class="other_form_input"
      ></v-text-field>
      <v-text-field
        v-model="cost"
        label="Расходы"
        class="other_form_input"
      ></v-text-field>
      <v-icon @click="addItem()" size="25" class="create_icon other_form_input">
        mdi-check
      </v-icon>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="items"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-close </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { projectsModule } from "../store/projects";
export default {
  data() {
    return {
      headers: [
        {
          text: "Название, описание",
          align: "start",
          value: "name",
        },
        { text: "Стоимость", value: "cost" },
        { text: "", value: "actions", sortable: false },
      ],
      items: [],
      name: "",
      cost: 0,
    };
  },
  created() {
    let id =
      document.location.href.match(/\/[0-9]+/g) &&
      document.location.href.match(/\/[0-9]+/g).length
        ? Number(document.location.href.match(/\/[0-9]+/g)[0].replace("/", ""))
        : null;
    if (id) {
      projectsModule.getOthers(id).then((response) => {
        window.project = {
          ...window.project,
          others: response.data,
        };
        this.items = response.data;
      });
    } else {
      window.project = {
        ...window.project,
        others: [],
      };
    }
  },
  methods: {
    addItem() {
      const id = this.items.length ? this.items[this.items.length - 1] + 1 : 1;
      const newItem = {
        name: this.name,
        cost: this.cost,
        id,
      };
      window.project.others.push(newItem);
      this.items.push(newItem);
      this.name = "";
      this.cost = 0;
    },
    deleteItem(item) {
      this.items = this.items.filter((itemArray) => itemArray.id !== item.id);
      window.project.others = [];
      this.items.forEach((elem) => {
        window.project.others.push(elem);
      });
    },
  },
};
</script>
<style scoped>
.new_other_form {
  display: flex;
}
.other_form_input {
  margin: 0 20px 0 20px;
}
</style>