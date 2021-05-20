const con = require("../../server");

let projectsData = {

    getProjects(req, res) {
        const query = "SELECT * FROM estimater.projects";
        con.con.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
            }
            else {
                res.json(result);
            }
        });
    },

    addProject(req, res) {
        const projectInfo = req.body;
        let query = `insert into estimater.projects (name, date_of_creation, status, creator, client, minHours, maxHours, profitability) 
        values ('${projectInfo.name}', '${new Date().toISOString()}', '${projectInfo.status}', '${projectInfo.creator}', 
        '${projectInfo.client}', ${projectInfo.minHours}, ${projectInfo.maxHours}, ${projectInfo.profitability})`;
        con.con.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
            }
            else {
                const projectId = result.insertId;
                Object.keys(projectInfo.phases).forEach((key) => {
                    const phase = projectInfo.phases[key];
                    query = `insert into estimater.phases (id, name, generalQAPercentage, generalPMPercentage, generalBugsPercentage, projectId, status) values (
                        ${key}, '${phase.name}', ${Number(phase.generalQAPercentage)}, ${Number(phase.generalPMPercentage)}, ${Number(phase.generalBugsPercentage)}, ${projectId}, ${phase.status}
                    )`;
                    con.con.query(query, (err, result) => {
                        if (err) {
                            res.status(500).send(err);
                            console.log(err);
                        }
                    });
                });
                Object.keys(projectInfo.tasks).forEach((key) => {
                    const tasksArray = projectInfo.tasks[key];
                    tasksArray.forEach((task) => {
                        query = `insert into estimater.tasks (phaseId, name, executorId, minHours, maxHours, qaPercentage, bugsPercentage, pmPercentage) values (
                            ${task.phaseId}, '${task.name}', ${task.executorId}, ${task.minHours}, ${task.maxHours}, ${task.qaPercentage}, ${task.bugsPercentage}, ${task.pmPercentage}
                        )`;
                        con.con.query(query, (err, result) => {
                            if (err) {
                                res.status(500).send(err);
                                console.log(err);
                            }
                        });
                    });
                });
                if (projectInfo.others) {
                    projectInfo.others.forEach((otherItem) => {
                        query = `insert into estimater.otherscosts (projectId, name, cost) values (
                                ${projectId}, '${otherItem.name}', ${otherItem.cost}
                            )`;
                        con.con.query(query, (err, result) => {
                            if (err) {
                                res.status(500).send(err);
                                console.log(err);
                            }
                        });
                    });
                }
                res.json({});
            }
        });
    },

    deleteProject(req, res) {
        const id = req.body.id;
        const query = `delete from estimater.projects where id = ${id}`;
        con.con.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
            }
            else {
                res.json(result);
            }
        });
    },

    getOthers(req, res) {
        const query = `select * from estimater.otherscosts where projectId = ${req.query.projectId}`;
        con.con.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
            }
            else {
                res.json(result);
            }
        });
    }
};
module.exports = projectsData;