import axios from 'axios';

function getSettings() {
    return axios.get("http://localhost:5354/settings");
}

// function addRole(role) {
//     return axios.post("http://localhost:5354/roles", role);
// }

// function deleteRole(id) {
//     return axios.delete("http://localhost:5354/roles", { data: { id } });
// }

// function editRole() {

// }

export const settingsModule = {
    getSettings
};

