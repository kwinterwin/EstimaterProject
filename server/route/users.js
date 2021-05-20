
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
			if (result?.length == 1) {
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

	// getAllUsers(req, res) {
	// 	const query = "SELECT users.*, logindata.* FROM prms.users as users, prms.user_logindata as logindata where users.user_id=logindata.id";
	// 	con.con.query(query, (err, result) => {
	// 		if (err) {
	// 			res.status(500).send(err);
	// 			console.log(err);
	// 		}
	// 		else {
	// 			res.json(result);
	// 		}
	// 	});
	// },

	// editData(req, res) {
	// 	const user = req.body;
	// 	let query = `update prms.user_logindata set login="${user.login}", password='${user.password}' where id=${user.id}`;
	// 	con.con.query(query, (err, result) => {
	// 		if (err) {
	// 			res.status(500).send(err);
	// 			console.log(err);
	// 		}
	// 		else {
	// 			query = `update prms.users set surname='${user.surname}', name='${user.name}', patronymic='${user.patronymic}', date_of_birth='${user.date_of_birth}', 
	// 			phone='${user.phone}', position = '${user.position}', photo = '${user.photo}' where info_id=${user.info_id}`;
	// 			con.con.query(query, (err, result) => {
	// 				if (err) {
	// 					res.status(500).send(err);
	// 					console.log(err);
	// 				}
	// 				else {
	// 					res.json(result);
	// 				}
	// 			});
	// 		}
	// 	});
	// },

	// addData(req, res) {
	// 	const user = req.body;
	// 	let query = "";
	// 	if (!user.hasOwnProperty("user_id")) {
	// 		query = `INSERT INTO prms.user_logindata (login, password) VALUES ('${user.login}', '${user.password}')`;
	// 		con.con.query(query, (err, result) => {
	// 			if (err) {
	// 				res.status(500).send(err);
	// 				console.log(err);
	// 			}
	// 			else {
	// 				query = `INSERT INTO prms.users (user_id, surname, name, patronymic, date_of_birth, phone, position, photo) VALUES
	// 													(${result.insertId},'${user.surname}','${user.name}', '${user.patronymic}', '${user.date_of_birth}', '${user.phone}', '${user.position}',
	// 													'${user.photo}')`;
	// 				con.con.query(query, (err, result) => {
	// 					if (err) {
	// 						res.status(500).send(err);
	// 						console.log(err);
	// 					}
	// 					else {
	// 						res.json(result);
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// 	else {
	// 		query = `update prms.user_logindata set login="${user.login}", password='${user.password}' where id=${user.user_id}`;
	// 		con.con.query(query, (err, result) => {
	// 			if (err) {
	// 				res.status(500).send(err);
	// 				console.log(err);
	// 			}
	// 			else {
	// 				query = `INSERT INTO prms.users (user_id, surname, name, patronymic, date_of_birth, phone, position, photo) VALUES
	// 						(${user.user_id},'${user.surname}','${user.name}', '${user.patronymic}', '${user.date_of_birth}', 
	// 						'${user.phone}', '${user.position}',
	// 						'${user.photo}')`;
	// 				con.con.query(query, (err, result) => {
	// 					if (err) {
	// 						res.status(500).send(err);
	// 						console.log(err);
	// 					}
	// 					else {
	// 						res.json(result);
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// },

	// addAvatarFile(req, res) {
	// 	const file = req.file;
	// 	res.json(file);
	// },

	// deleteUser(req, res) {
	// 	const user_id = req.params.id;
	// 	const query = `delete from prms.user_logindata where id=${user_id}`;
	// 	con.con.query(query, (err, result) => {
	// 		if (err) {
	// 			res.status(500).send(err);
	// 			console.log(err);
	// 		}
	// 		else {
	// 			res.json(result);
	// 		}
	// 	});
	// }
};

module.exports = usersData;
