import axios from 'axios';

function getLastPhasesId() {
    return axios.get("http://localhost:5354/phases/last");
}

function getPhasesFromId(phaseId) {
    console.log(phaseId);
    return axios.get("http://localhost:5354/phases", {
        params: {
            phaseId
        }
    });
}

export const phasesModule = {
    getLastPhasesId,
    getPhasesFromId
};

