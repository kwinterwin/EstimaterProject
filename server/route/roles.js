const con = require("../../server");

let rolesData = {

    getRoles(req, res) {
        const query = "SELECT * FROM estimater.roles";
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

    addRole(req, res) {
        const query = `insert into estimater.roles (name,salary, salaryHour) values ('${req.body.name}', ${req.body.salary}, ${parseFloat((req.body.salary / 160).toFixed(2))})`;
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

    deleteRole(req, res) {
        const id = req.body.id;
        const query = `delete from estimater.roles where id = ${id}`;
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
};
module.exports = rolesData;