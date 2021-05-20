
const con = require("../../server");

let usersData = {

	login(req, res) {
		const user = {};
		user.email = req.query.email;
		user.password = req.query.password;
		let query = `select * from estimater.users where email='${user.email}' and password='${user.password}'`;
		con.con.query(query, (err, result) => {
			if (err) {
				res.status(500).send(err);
				console.log(err);
			}
			console.log(result);
			if (result && result.length == 1) {
				res.send(result[0]);
			} else {
				res.json({ type: "error", "message": "Вы ввели неверный логин или пароль." });
			}
		});
	},

	loginStatus(req, res) {
		res.send(req.session.user || null);
	},

	logout(req, res) {
		delete req.session.user;
		res.send({});
	},

	authorization: function (req, res) {
		let query = `SELECT * FROM estimater.users where login='${req.body.email}'`;
		con.con.query(query, (err, result) => {
			if (!result || result.length === 0) {
				query = `INSERT INTO estimater.users (email, password, name, surname) VALUES ("${req.body.email}", "${req.body.password}", "${req.body.name}", '${req.body.surname}');`;
				con.con.query(query, (err, result) => {
					if (err) {
						res.status(500).send(err);
						console.log(err);
					}
					else
						res.json({ userId: result.insertId });
				});
			}
			else res.json({ "message": "Пользователь с данной почтой уже зарегистрирован." });
		});
	},
};

module.exports = usersData;
