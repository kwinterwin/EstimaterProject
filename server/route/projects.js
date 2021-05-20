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

    updateProject(req, res) {
        // this.deleteProject(req, res);
        // this.addProject(req, res);
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

    // getAllGoods(req, res) {
    // const query = "select * from prms.goods";
    // con.con.query(query, (err, result) => {
    //     if (err) {
    //         res.status(500).send(err);
    //         console.log(err);
    //     }
    //     else {
    //         res.json(result);
    //     }
    // });
    // },

    // addGood(req, res) {
    //     const good = req.body;
    //     let query = `INSERT INTO prms.goods (name, price, manuf_country, articul, category_id, barcode, brand, total_count,supplier_id)
    //                                    VALUES ('${good.name}', ${good.price}, '${good.manuf_country}', '${good.articul}', 
    //                                    ${good.category_id}, '${good.barcode}', '${good.brand}', ${good.count}, ${good.supplier_id})`;
    //     con.con.query(query, (err, result) => {
    //         if (err) {
    //             res.status(500).send(err);
    //             console.log(err);
    //         }
    //         else {
    //             if (result.insertId) {
    //                 query = `INSERT INTO prms.registration_reports (good_id, user_id, proposal_id, date_registration)
    //                 VALUES (${parseInt(result.insertId)}, ${good.user_id}, ${good.proposal_id}, '${good.date_registration}')`;
    //                 con.con.query(query, (err, result) => {
    //                     if (err) {
    //                         res.status(500).send(err);
    //                         console.log(err);
    //                     }
    //                     else {
    //                         res.json(result);
    //                     }
    //                 });
    //             }
    //             else res.json(result);
    //         }
    //     });
    // },

    // getGood(req, res) {
    //     const id = req.params.id;
    //     const query = `select * from prms.goods where category_id=${id}`;
    //     con.con.query(query, (err, result) => {
    //         if (err) {
    //             res.status(500).send(err);
    //             console.log(err);
    //         }
    //         else {
    //             res.json(result);
    //         }
    //     });
    // },

    // getGoodForId(req, res) {
    //     const id = req.params.id;
    //     const query = `select * from prms.goods where id=${id}`;
    //     con.con.query(query, (err, result) => {
    //         if (err) {
    //             res.status(500).send(err);
    //             console.log(err);
    //         }
    //         else {
    //             res.json(result);
    //         }
    //     });
    // },

    // updateGoodInformation(req, res) {
    //     const id = req.params.id;
    //     const good = req.body;
    //     const query = `UPDATE prms.goods SET name = "${good.name}", price=${good.price}, manuf_country = "${good.manuf_country}",
    //                 articul = "${good.articul}", category_id = ${good.category_id}, barcode = "${good.barcode}",
    //                  brand = "${good.brand}", total_count = ${good.total_count}, supplier_id=${good.supplier_id}
    //                 WHERE id = ${id}`;
    //     con.con.query(query, (err, result) => {
    //         if (err) {
    //             res.status(500).send(err);
    //             console.log(err);
    //         }
    //         else {
    //             res.json(result);
    //         }
    //     });
    // }
};
module.exports = projectsData;