const con = require("../../server");

const settingsData = {

    getAllSettings(req, res) {
        con.con.query("SELECT * FROM estimater.settings", (err, result) => {
            if (err) throw err;
            else res.json(result);
        });
    },
};

module.exports = settingsData;