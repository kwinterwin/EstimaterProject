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
	}

};
module.exports = tasksData;