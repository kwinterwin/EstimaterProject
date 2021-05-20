const con = require("../../server");

let phasesData = {

    getLastPhaseId(req, res) {
        con.con.query('SELECT MAX(id) as maxId FROM estimater.phases;', (err, result) => {
            if (err) {
                res.status(500).send(err);
                console.log(err);
            }
            else {
                const maxId = result[0].maxId ? result[0].maxId + 1 : 1;
                res.json({ maxId });
            }
        });
    },

    getPhasesForId(req, res){
        const query = `SELECT * FROM estimater.phases where projectId=${req.query.phaseId}`;
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
module.exports = phasesData;