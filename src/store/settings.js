import axios from 'axios';

function getSettings() {
    return axios.get("http://localhost:5354/settings");
}

function updateSetings(settings) {
    return axios.post("http://localhost:5354/settings", settings);
}

// function deleteRole(id) {
//     return axios.delete("http://localhost:5354/roles", { data: { id } });
// }

// function editRole() {

// }

export const settingsModule = {
    getSettings,
    updateSetings
};

