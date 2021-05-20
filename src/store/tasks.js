import axios from 'axios';

function getTasks(phaseId) {
    return axios.get("http://localhost:5354/tasks", {
        params: {
            phaseId
        }
    });
}

function addTasks(tasks) {
    return axios.post("http://localhost:5354/tasks", { tasks });
}

// function deleteRole(id) {
//     return axios.delete("http://localhost:5354/roles", { data: { id } });
// }

// function editRole() {

// }

export const tasksModule = {
    getTasks,
    addTasks
};

