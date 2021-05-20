<template>
  <div class="project_module">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="projects"
      :search="search"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-fab-transition>
      <v-btn
        color="blue"
        fab
        large
        dark
        bottom
        left
        class="v-btn--example"
        @click="newProject()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>
<script>
import { projectsModule } from "../store/projects";
import { DateTime } from "luxon";
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: "",
    headers: [
      {
        text: "Название",
        align: "start",
        value: "name",
      },
      { text: "Дата создания", value: "date_of_creation" },
      { text: "Количество часов", value: "hours" },
      { text: "Статус оценки", value: "status" },
      { text: "", value: "actions", sortable: false },
    ],
    projects: [],
  }),

  created() {
    projectsModule.getProjects().then((res) => {
      this.projects = res.data.map((item) => {
        var d = DateTime.fromISO(item.date_of_creation).setLocale("ru");
        return {
          ...item,
          date_of_creation: d.toFormat("DDD"),
          hours: `${item.minHours} ч. - ${item.maxHours} ч.`,
          status: window.Statuses[item.status],
        };
      });
    });
  },

  methods: {
    newProject() {
      this.$router.push("/project");
    },
    editItem(item) {
      this.$router.push(`/project/${item.id}`);
    },
    deleteItem(item) {
      this.projects = this.projects.filter((project) => project.id !== item.id);
      projectsModule.deleteProject(item.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-btn--example {
  bottom: 0;
  position: absolute;
  right: 0;
  margin: 0 16px 16px 0;
}
.project_module {
  flex-grow: 1;
}
th.text-start {
  text-align: start;
}
</style>