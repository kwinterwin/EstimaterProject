const con = require("../../server");

let tasksData = {

	getTasksForPhaseId(req, res) {
		let query;
		if (req.query?.phaseId) {
			query = `select * from estimater.tasks where phaseId=${req.query.phaseId}`;
		} else {
			query = 'select * from estimater.tasks';
		}
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

	addTasks(req, res) {
		const tasks = req.body.tasks;
		let query = '';
		for (let i = 0; i < tasks.length; i++) {
			let task = tasks[i];
			query = `INSERT INTO estimater.tasks (phaseId, name, executorId, minHours, maxHours, qaPercentage, bugsPercentage, pmPercentage) VALUES
			(${task.phaseId}, "${task.name}",${task.executorId}, ${parseFloat(task.minHours)}, 
			${parseFloat(task.maxHours)}, ${parseFloat(task.qaPercentage)},${parseFloat(task.bugsPercentage)},${parseFloat(task.pmPercentage)});
			`;
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
	},

	deleteTask(req, res) {
		const id = req.body.id;
		const query = `delete from estimater.tasks where id = ${id}`;
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

	// updateProposal(req, res) {
	// 	const proposal = req.body;
	// 	if (proposal.date_completed) {
	// 		proposal.date_completed = formatDate(proposal.date_completed);
	// 	}
	// 	const query = `Update prms.proposals set name = "${proposal.name}", user_id = ${proposal.user_id}, category_id = ${proposal.category_id}, 
	//                         count = ${proposal.count}, supplier_id = ${proposal.supplier_id},
	//                         date_registration = "${formatDate(proposal.date_registration)}",
	//                         status = "${proposal.status}", date_approve = "${formatDate(proposal.date_approve)}" 
	//                         ${proposal.date_completed ? (",date_completed = '" + proposal.date_completed + "'") : ""} where id = ${proposal.id}
	//     `;
	// 	con.con.query(query, (err, result) => {
	// 		if (err) {
	// 			res.status(500).send(err);
	// 			console.log(err);
	// 		}
	// 		else {
	// 			res.json(result);
	// 			if (proposal.status === "accepted" || proposal.status === "rejected") {
	// 				let query = `select ul.*, users.position from prms.user_logindata as ul, prms.users as users where ul.id=${proposal.user_id} AND users.user_id=${proposal.user_id}`;
	// 				con.con.query(query, (err, result) => {
	// 					if (err) {
	// 						res.status(500).send(err);
	// 						console.log(err);
	// 					}
	// 					if (result.length == 1) {
	// 						const mailOptions = {
	// 							from: "'Product Management system' <pmSystem.20@gmail.com>",
	// 							to: result[0].login,
	// 							subject: proposal.status === "accepted" ? "Утверждение заявки" : "Отклонение заявки",
	// 							text: "",
	// 							html: `
	//                             <p>Уважаемый(-ая) ${result[0].position}.</p>
	//                             <p>Ваша заявка на закупку <b>${proposal.name}</b> была <i>${proposal.status === "accepted" ? "утверждена" : "отклонена"}</i> в Product Management system.</p>
	//                             <p>${proposal.status === "accepted" ?
	// 	"Можете регистрировать товар через программное обеспечение в вашем личном кабинете." :
	// 	"По всем вопросам обращайтесь к администратору."}</p>
	//                             <p>С уважением, Product Management System</p>
	//                             `
	// 						};

	// 						transporter.sendMail(mailOptions, (err, res) => {
	// 							if (err) {
	// 								console.log("Error");
	// 							} else {
	// 								console.log("Email sent!!");
	// 							}
	// 						});
	// 					}
	// 				});

	// 			}
	// 		}
	// 	});
	// }

};
module.exports = tasksData;