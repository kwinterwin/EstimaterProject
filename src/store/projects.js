import axios from 'axios';

function getProjects() {
  return axios.get("http://localhost:5354/projects");
}

function addProject(project) {
  return axios.post("http://localhost:5354/projects", project);
}

function deleteProject(projectId) {
  return axios.delete("http://localhost:5354/projects", { data: { id: projectId } });
}

function getOthers(projectId) {
  return axios.get("http://localhost:5354/others", {
    params: {
      projectId
    }
  });
}

function updateProject(project) {
  return axios.post("http://localhost:5354/projects/update", project);
}

export const projectsModule = {
  getProjects,
  addProject,
  deleteProject,
  getOthers,
  updateProject
};

