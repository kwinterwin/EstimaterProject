<template>
  <div class="project_module">
    <v-card class="tabs_container">
      <v-tabs show-arrows v-model="tab">
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="item in tabs" :key="item.key" class="tab_item"
          ><span>{{ item.title }}</span
          ><v-icon
            size="15"
            class="close_button"
            right
            v-if="item.canDeleted"
            @click="deletePhase(item)"
          >
            mdi-close
          </v-icon>
        </v-tab>
      </v-tabs>
      <md-dialog :md-active.sync="dialog">
        <md-content>
          <v-form ref="form" lazy-validation class="new_phase_form">
            <v-text-field
              v-model="PhaseName"
              label="Название фазы"
              required
            ></v-text-field>
          </v-form>
        </md-content>

        <md-dialog-actions>
          <md-button class="md-primary" @click="addPhase()"
            >Сохранить</md-button
          >
        </md-dialog-actions>
      </md-dialog>
      <v-icon class="create_icon" @click="dialog = true"> mdi-plus </v-icon>
      <v-icon class="create_icon" @click="saveProject()">
        mdi-content-save-all
      </v-icon>
    </v-card>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab.key" class="project_card">
        <PhaseInfo
          v-if="tab.key !== 'aboutProject' && tab.key !== 'others'"
          :phaseId="tab.phaseId"
        ></PhaseInfo>
        <div v-if="tab.key === 'aboutProject'">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="project.name"
              label="Название проекта"
              required
              @change="updateWindowVariable()"
            ></v-text-field>
            <v-text-field
              v-model="project.client"
              label="Клиент"
              required
              @change="updateWindowVariable()"
            ></v-text-field>
            <v-text-field
              v-model="project.creator"
              label="Создатель оценки"
              required
              disabled
            ></v-text-field>
            <v-text-field
              v-model="project.profitability"
              label="Уровень рентабельности"
              required
              @change="updateWindowVariable()"
            ></v-text-field>
          </v-form>
          <div v-if="isProfitVisible">
            <p class="p_general">
              Заработная плата по проекту:
              <span class="p_general_value">{{ projectSalary }}</span>
              <span class="currency">BYN</span>
            </p>
            <p class="p_general">
              Дополнительные расходы проекта:
              <span class="p_general_value">{{ othersMoney }}</span>
              <span class="currency">BYN</span>
            </p>
            <p class="p_general">
              Чистая прибыль от проекта:
              <span class="p_general_value">{{ clearProjectProfit }}</span>
              <span class="currency">BYN</span>
            </p>
            <p class="p_general">
              Прогнозируемая цена проекта:
              <span class="p_general_value">{{ releasedProfit }}</span>
              <span class="currency">BYN</span>
            </p>
          </div>
        </div>
        <Others v-if="tab.key === 'others'"></Others>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { usersModule } from "../store/users";
import PhaseInfo from "./PhaseInfo";
import Others from "./OthersProjectCost";
import { phasesModule } from "../store/phases";
import { projectsModule } from "../store/projects";
import { tasksModule } from "../store/tasks";
import { getProfit } from "../constants";
export default {
  components: { PhaseInfo, Others },
  data() {
    return {
      project: {
        name: "",
        client: "",
        creator: `${usersModule.getUser().name} ${
          usersModule.getUser().surname
        }`,
        minHours: 0,
        maxHours: 0,
        profitability: 0,
      },
      isProfitVisible: false,
      id: null,
      salaryDialog: false,
      tab: null,
      dialog: false,
      tabs: [
        {
          key: "aboutProject",
          title: "о проекте",
          id: 1,
          canDeleted: false,
        },
        {
          id: 2,
          key: "others",
          title: "прочие расходы",
          canDeleted: false,
        },
      ],
      PhaseName: "",
      clearProjectProfit: 0,
      projectSalary: 0,
      releasedProfit: 0,
      othersMoney: 0,
    };
  },
  created() {
    setTimeout(() => {
      document.querySelector(".tab_item").addEventListener("click", () => {
        getProfit();
        this.clearProjectProfit = window.clearProfit || 0;
        this.projectSalary = window.projectSalary || 0;
        this.releasedProfit = window.releasedProfit || 0;
        this.othersMoney = window.othersMoney || 0;
        this.isProfitVisible = window.profitIsCounted;
      });
    }, 0);
    this.id =
      document.location.href.match(/\/[0-9]+/g) &&
      document.location.href.match(/\/[0-9]+/g).length
        ? Number(document.location.href.match(/\/[0-9]+/g)[0].replace("/", ""))
        : null;
    projectsModule.getProjects().then((response) => {
      const project = response.data.find((item) => item.id == this.id);
      if (project) {
        this.project = {
          ...project,
        };
        Promise.all([
          phasesModule.getPhasesFromId(this.id),
          tasksModule.getTasks(),
          projectsModule.getOthers(this.id)
        ]).then(
          ([
            responsePhases,
            responseTasks,
            responseOthers,
          ]) => {
            window.project.phases = {};
            window.project.tasks = {};
            window.project.others = responseOthers.data;
            responsePhases.data.forEach((item) => {
              window.project.phases[item.id] = item;
              this.tabs.push({
                id: item.id,
                key: `phase${item.id}`,
                title: item.name,
                canDeleted: item.status === 1 ? true : false,
                phaseId: item.id,
              });
              window.project.tasks[item.id] = responseTasks.data.filter(
                (task) => task.phaseId === item.id
              );
            });
            getProfit();
            this.clearProjectProfit = window.clearProfit || 0;
            this.projectSalary = window.projectSalary || 0;
            this.releasedProfit = window.releasedProfit || 0;
            this.othersMoney = window.othersMoney || 0;
            this.isProfitVisible = window.profitIsCounted;
          }
        );
      }
      window.project = project ? project : {};
    });
  },
  methods: {
    addPhase() {
      phasesModule.getLastPhasesId().then((response) => {
        let phaseId =
          window.lastPhaseId >= response.data.maxId
            ? window.lastPhaseId + 1
            : response.data.maxId;
        window.lastPhaseId = phaseId;
        const id = this.tabs.length
          ? this.tabs[this.tabs.length - 1].id + 1
          : 1;
        const newItem = {
          id,
          key: `phase${id}`,
          title: this.PhaseName,
          canDeleted: true,
          phaseId,
        };
        this.tabs.push(newItem);
        window.project = {
          ...window.project,
          phases: {
            ...window.project.phases,
            [phaseId]: {
              name: this.PhaseName,
            },
          },
        };
        this.PhaseName = "";
        this.dialog = false;
      });
    },
    deletePhase(item) {
      this.tabs = this.tabs.filter((tab) => tab.id !== item.id);
      delete window.project.tasks[item.phaseId];
      delete window.project.phases[item.phaseId];
    },
    saveProject() {
      window.project.minHours = parseFloat(
        Object.values(window.project.phases)
          .reduce((sum, item) => {
            return sum + parseFloat(item.phaseMinHours);
          }, 0)
          .toFixed(2)
      );
      window.project.maxHours = parseFloat(
        Object.values(window.project.phases)
          .reduce((sum, item) => {
            return sum + parseFloat(item.phaseMaxHours);
          }, 0)
          .toFixed(2)
      );
      const isOnePhaseStarted = Object.values(window.project.phases).some(
        (item) => item.status === 2
      );
      const isAllPhasesCompleted = Object.values(window.project.phases).every(
        (item) => item.status === 3
      );
      window.project.status = isOnePhaseStarted
        ? 2
        : isAllPhasesCompleted
        ? 3
        : 1;
      if (window.project.id) {
        projectsModule.updateProject(window.project).finally(() => {
          this.$router.push("/projects");
        });
      } else {
        projectsModule.addProject(window.project).finally(() => {
          this.$router.push("/projects");
        });
      }
    },
    updateWindowVariable() {
      window.project = {
        ...window.project,
        name: this.project.name,
        client: this.project.client,
        creator: this.project.creator,
        minHours: 0,
        maxHours: 0,
        profitability: this.project.profitability,
      };
    },
  },
};
</script>
<style scoped>
.project_module {
  flex-grow: 1;
}
.project_card {
  padding: 10px 20px 10px 20px;
}
.tabs_container {
  display: flex;
}
.create_icon {
  margin-left: 10px;
  margin-right: 10px;
}
.close_button {
  margin-left: 5px;
  margin-right: 5px;
}
.tab_item {
  display: flex;
}
.new_phase_form {
  margin: 10px 20px 10px 20px;
  min-width: 350px;
}
.button_salary {
  background-color: #1867c0 !important;
}
.p_general {
  font-size: 20px;
  color: grey;
  margin-bottom: 13px;
}
form {
  margin-bottom: 20px;
}
.p_general_value {
  color: black;
}
.currency{
  margin-left: 5px;
}
</style>