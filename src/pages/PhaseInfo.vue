<template>
  <div class="phase_module">
    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="generalPM"
        label="Общие PM/AM, %"
        class="general_inputs"
        @input="phaseUpdated()"
      ></v-text-field>
      <v-text-field
        v-model="generalBugs"
        label="Общие баги, %"
        class="general_inputs"
        @input="phaseUpdated()"
      ></v-text-field>
      <v-text-field
        v-model="generalQA"
        label="QA, %"
        class="general_inputs"
        @input="phaseUpdated()"
      ></v-text-field>
    </v-form>
    <v-form ref="form" lazy-validation class="new_task_form">
      <v-text-field
        v-model="taskName"
        label="Название, описание"
      ></v-text-field>
      <v-icon @click="addItem()" size="25" class="create_icon">
        mdi-check
      </v-icon>
    </v-form>
    <v-data-table
      :headers="tasksHeaders"
      :items="tasks"
      hide-default-footer
      class="elevation-1 my_datatable"
    >
      <template v-slot:item.executorId="{ item }">
        <md-field>
          <md-select name="executor" v-model="item.executorId">
            <md-option
              :value="option.id"
              v-for="option in roles"
              :key="option.id"
              >{{ option.name }}</md-option
            >
          </md-select>
        </md-field>
      </template>
      <template v-slot:item.qaPer="{ item }">
        <v-text-field
          label=""
          v-model="item.qaPercentage"
          class="qa_percentage"
          @input="PercentageChanges(item)"
        ></v-text-field>
      </template>
      <template v-slot:item.pmPer="{ item }">
        <v-text-field
          label=""
          v-model="item.pmPercentage"
          class="qa_percentage"
          @input="PercentageChanges(item)"
        ></v-text-field>
      </template>
      <template v-slot:item.bugsPer="{ item }">
        <v-text-field
          label=""
          v-model="item.bugsPercentage"
          class="qa_percentage"
          @input="PercentageChanges(item)"
        ></v-text-field>
      </template>
      <template v-slot:item.hours="{ item }">
        <div class="hours_container">
          <v-text-field
            label=""
            v-model="item.minHours"
            class="hours_interval"
            @change="SetInitialHours(item, 'min')"
          ></v-text-field>
          <v-text-field
            label=""
            v-model="item.maxHours"
            class="hours_interval"
            @change="SetInitialHours(item, 'max')"
          ></v-text-field>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)"> mdi-close </v-icon>
      </template>
    </v-data-table>
    <div class="phase_general_info">
      <div class="phaseButtonStatus" v-if="buttonStatusTitle">
        <button class="phase_status_buton" @click="updatePhaseStatus()">
          {{ buttonStatusTitle }}
        </button>
      </div>
      <div class="phase_general_hours">
        <div class="phase_general_status phase_general_hours_item_title" >
          <span>Статус фазы:</span><span class="statusPhase">{{statusPhaseString}}</span>
        </div>
        <div class="phase_general_hours_item">
          <div class="phase_general_hours_item_title">Часы фазы</div>
          <div class="phase_general_hours_item_hours">
            <span>{{ phaseMinHours }}</span
            >&#160;&#8212;&#160;<span>{{ phaseMaxHours }}</span>
          </div>
        </div>
        <div class="phase_general_hours_item">
          <div class="phase_general_hours_item_title">QA, ч</div>
          <div class="phase_general_hours_item_hours">
            <span>{{ generalQAMinHours }}</span
            >&#160;&#8212;&#160;<span>{{ generalQAMaxHours }}</span>
          </div>
        </div>
        <div class="phase_general_hours_item">
          <div class="phase_general_hours_item_title">PM/AM, ч</div>
          <div class="phase_general_hours_item_hours">
            <span>{{ generalPMMinHours }}</span
            >&#160;&#8212;&#160;<span>{{ generalPMMaxHours }}</span>
          </div>
        </div>
        <div class="phase_general_hours_item">
          <div class="phase_general_hours_item_title">BUGS, ч</div>
          <div class="phase_general_hours_item_hours">
            <span>{{ generalBugsMinHours }}</span
            >&#160;&#8212;&#160;<span>{{ generalBugsMaxHours }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { rolesModule } from "../store/roles";
import { tasksModule } from "../store/tasks";
// import { phasesModule } from "../store/phases";
export default {
  props: ["phaseId"],
  data() {
    return {
      tasksHeaders: [
        {
          text: "Название, описание",
          align: "start",
          value: "name",
        },
        { text: "Роль", value: "executorId" },
        { text: "Часы от - до", value: "hours" },
        { text: "QA,%", value: "qaPer" },
        { text: "PM,%", value: "pmPer" },
        { text: "Bugs,%", value: "bugsPer" },
        { text: "", value: "actions", sortable: false },
      ],
      tasks: [],
      phaseMinHours: 0,
      phaseMaxHours: 0,
      generalQAMinHours: 0,
      generalQAMaxHours: 0,
      generalBugsMinHours: 0,
      generalBugsMaxHours: 0,
      generalPMMinHours: 0,
      generalPMMaxHours: 0,
      generalPM: 0,
      generalBugs: 0,
      generalQA: 0,
      taskName: "",
      roles: [],
      phaseStatus: 1,
    };
  },
  created() {
    rolesModule.getRoles().then((response) => {
      this.roles = response.data;
    });
    const phase = window.project.phases[this.phaseId];
    this.generalPM = phase.generalPMPercentage ? phase.generalPMPercentage : 0;
    this.generalBugs = phase.generalBugsPercentage
      ? phase.generalBugsPercentage
      : 0;
    this.generalQA = phase.generalQAPercentage ? phase.generalQAPercentage : 0;
    this.phaseStatus = phase.status ? phase.status : 1;
    tasksModule.getTasks(this.phaseId).then((response) => {
      this.tasks = response.data.map((item) => {
        return {
          ...item,
          initMaxHours: item.maxHours,
          initMinHours: item.minHours,
        };
      });
      window.project = {
        ...window.project,
        tasks: {
          ...window.project.tasks,
          [this.phaseId]: this.tasks,
        },
      };
      this.phaseUpdated();
    });
  },
  methods: {
    addItem() {
      const id = this.tasks.length
        ? this.tasks[this.tasks.length - 1].id + 1
        : 1;
      const newItem = {
        name: this.taskName,
        phaseId: this.phaseId,
        executorId: null,
        minHours: 0,
        maxHours: 0,
        qaPercentage: 0,
        bugsPercentage: 0,
        pmPercentage: 0,
        id,
        initMaxHours: 0,
        initMinHours: 0,
      };
      this.tasks.push(newItem);
      this.taskName = "";
      window.project = {
        ...window.project,
        tasks: {
          ...window.project.tasks,
          [this.phaseId]: this.tasks,
        },
      };
    },
    deleteItem(item) {
      this.tasks = this.tasks.filter((itemArray) => itemArray.id !== item.id);
      this.phaseUpdated();
      window.project = {
        ...window.project,
        tasks: {
          ...window.project.tasks,
          [this.phaseId]: this.tasks,
        },
      };
    },
    PercentageChanges(item) {
      item.minHours = parseFloat(
        (
          parseFloat(item.initMinHours) *
          (1 +
            (parseInt(item.pmPercentage || 0) +
              parseInt(item.bugsPercentage || 0) +
              parseInt(item.qaPercentage || 0)) /
              100)
        ).toFixed(1)
      );
      item.maxHours = parseFloat(
        (
          parseFloat(item.initMaxHours) *
          (1 +
            (parseInt(item.pmPercentage || 0) +
              parseInt(item.bugsPercentage || 0) +
              parseInt(item.qaPercentage || 0)) /
              100)
        ).toFixed(1)
      );
      this.phaseUpdated();
    },
    SetInitialHours(item, str) {
      if (str === "min") {
        item.initMinHours = item.minHours;
      } else {
        item.initMaxHours = item.maxHours;
      }
      this.phaseUpdated();
    },
    phaseUpdated() {
      let minHours = this.tasks.reduce(
        (sum, elem) => sum + parseFloat(elem.minHours),
        0
      );
      minHours =
        ((parseInt(this.generalBugs || 0) +
          parseInt(this.generalQA || 0) +
          parseInt(this.generalPM || 0)) /
          100) *
          minHours +
        minHours;
      this.phaseMinHours = parseFloat(minHours.toFixed(2));
      let maxHours = this.tasks.reduce(
        (sum, elem) => sum + parseFloat(elem.maxHours),
        0
      );
      maxHours =
        ((parseInt(this.generalBugs || 0) +
          parseInt(this.generalQA || 0) +
          parseInt(this.generalPM || 0)) /
          100) *
          maxHours +
        maxHours;
      this.phaseMaxHours = parseFloat(maxHours.toFixed(2));
      const generalQAMin = parseFloat(
        this.tasks
          .reduce(
            (sum, elem) => sum + (elem.qaPercentage / 100) * elem.minHours,
            0
          )
          .toFixed(2)
      );
      const generalQAMax = parseFloat(
        this.tasks
          .reduce(
            (sum, elem) => sum + (elem.qaPercentage / 100) * elem.maxHours,
            0
          )
          .toFixed(2)
      );
      this.generalQAMinHours = parseFloat(
        ((this.generalQA / 100) * this.phaseMinHours + generalQAMin).toFixed(2)
      );
      this.generalQAMaxHours = parseFloat(
        ((this.generalQA / 100) * this.phaseMaxHours + generalQAMax).toFixed(2)
      );
      const generalPMMin = parseFloat(
        this.tasks
          .reduce(
            (sum, elem) => sum + (elem.pmPercentage / 100) * elem.minHours,
            0
          )
          .toFixed(2)
      );
      const generalPMMax = parseFloat(
        this.tasks
          .reduce(
            (sum, elem) => sum + (elem.pmPercentage / 100) * elem.maxHours,
            0
          )
          .toFixed(2)
      );
      this.generalPMMinHours = parseFloat(
        ((this.generalPM / 100) * this.phaseMinHours + generalPMMin).toFixed(2)
      );
      this.generalPMMaxHours = parseFloat(
        ((this.generalPM / 100) * this.phaseMaxHours + generalPMMax).toFixed(2)
      );
      const generalBugsMin = parseFloat(
        this.tasks
          .reduce(
            (sum, elem) => sum + (elem.bugsPercentage / 100) * elem.minHours,
            0
          )
          .toFixed(2)
      );
      const generalBugsMax = parseFloat(
        this.tasks
          .reduce(
            (sum, elem) => sum + (elem.bugsPercentage / 100) * elem.maxHours,
            0
          )
          .toFixed(2)
      );
      this.generalBugsMinHours = parseFloat(
        (
          (this.generalBugs / 100) * this.phaseMinHours +
          generalBugsMin
        ).toFixed(2)
      );
      this.generalBugsMaxHours = parseFloat(
        (
          (this.generalBugs / 100) * this.phaseMaxHours +
          generalBugsMax
        ).toFixed(2)
      );
      window.project = {
        ...window.project,
        tasks: {
          ...window.project.tasks,
          [this.phaseId]: this.tasks,
        },
        phases: {
          ...window.project.phases,
          [this.phaseId]: {
            ...window.project.phases[this.phaseId],
            generalQAPercentage: this.generalQA,
            generalPMPercentage: this.generalPM,
            generalBugsPercentage: this.generalBugs,
            phaseMinHours: this.phaseMinHours,
            phaseMaxHours: this.phaseMaxHours,
            status: this.phaseStatus,
          },
        },
      };
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
      if (window.project.others) {
        // window.project.others.forEach((item) => {});
      }
    },
    updatePhaseStatus() {
      this.phaseStatus = this.phaseStatus + 1;
      window.project.phases[this.phaseId].status = this.phaseStatus;
    },
  },
  computed: {
    buttonStatusTitle() {
      let title = "";
      if (this.phaseStatus === 1) {
        title = "Начать выполнение";
      } else if (this.phaseStatus === 2) {
        title = "отметить как готовую";
      }
      return title;
    },
    statusPhaseString(){
      return window.Statuses ? window.Statuses[this.phaseStatus] : '';
    }
  },
};
</script>
<style scoped>
.hours_interval {
  display: inline-block;
  max-width: 50px;
  min-width: 50px;
}
.hours_interval:first-child {
  margin-right: 20px;
}
.hours_container {
  display: flex;
}
.qa_percentage {
  max-width: 30px;
  min-width: 30px;
}
.general_inputs {
  max-width: 120px;
  display: inline-block;
  margin-left: 20px;
}
.new_task_form {
  display: flex;
}
.create_icon {
  margin-left: 20px;
}
.phase_general_info {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 2;
  background-color: #d8e6f3;
  font-size: 13px;
  box-shadow: 0 -1px 5px rgb(0 0 0 /20%);
  padding-top: 14px;
  padding-bottom: 14px;
}
.phaseButtonStatus {
  position: absolute;
  left: 50%;
}
.statusPhase{
  color: black !important;
  display: inline-block;
  margin: 0 0 0 5px;
}
.phase_status_buton {
  margin: 0 auto;
  position: relative;
  left: -50%;
  background-color: #eef3f6 !important;
  color: #1b3c90;
  text-decoration: none;
  border: 1px solid;
  top: -36px;
  border-radius: 3px;
  min-height: 36px;
  display: inline-block;
  padding: 0 6px;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
}
.phase_general_status{
  flex-grow: 1;
  margin: 0 0 0 20px;
}
.phase_general_hours {
  display: flex;
  justify-content: flex-end;
}
.phase_general_hours_item {
  display: inline-block;
  padding: 10px 15px;
}
.phase_general_hours_item_title {
  color: #1b3c90;
  font-weight: 700;
  margin-bottom: 10px;
}
.phase_general_hours_item_hours {
  color: #676767;
  font-size: 10px;
}
.my_datatable {
  height: 420px;
  overflow: auto;
}
</style>