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
module.exports = rolesData;