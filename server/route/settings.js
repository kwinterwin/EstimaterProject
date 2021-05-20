const con = require("../../server");

const settingsData = {

    getAllSettings(req, res) {
        con.con.query("SELECT * FROM estimater.settings", (err, result) => {
            if (err) throw err;
            else res.json(result);
        });
    },

    updateSettings(req, res) {
        const settings = req.body;
        let query = '';
        req.body.forEach((setting) => {
            query = `UPDATE estimater.settings SET value = ${setting.value} WHERE id = ${setting.id}`;
            con.con.query(query, (err, result) => {
                if (err) throw err;
            });
            res.json({});
        })
    }
};

module.exports = settingsData;