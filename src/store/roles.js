import axios from 'axios';

function getRoles() {
    return axios.get("http://localhost:5354/roles");
}

function addRole(role) {
    return axios.post("http://localhost:5354/roles", role);
}

function deleteRole(id) {
    return axios.delete("http://localhost:5354/roles", { data: { id } });
}

function editRole() {

}

export const rolesModule = {
    getRoles,
    addRole,
    deleteRole,
    editRole
};

