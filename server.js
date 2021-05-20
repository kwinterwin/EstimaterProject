const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
const { DBConfig } = require("./config");
const projects = require('./server/route/projects');
const users = require("./server/route/users");
const settings = require("./server/route/settings");
const roles = require("./server/route/roles");
const tasks = require("./server/route/tasks");
const phases = require("./server/route/phases");
const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});
const port = 5354;

const con = mysql.createConnection({
	host: DBConfig.host,
	user: DBConfig.user,
	password: DBConfig.password
});

con.connect((err) => {
	if (err) throw err;
	console.log("Connected...");
});

app.use("/server", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/projects", projects.getProjects);

app.get("/login", users.login);
app.post("/authorization", users.authorization);
app.get('/roles', roles.getRoles);
app.post('/roles', roles.addRole);
app.delete('/roles', roles.deleteRole);

app.get('/tasks', tasks.getTasksForPhaseId);
app.post('/tasks', tasks.addTasks);
app.delete('tasks', tasks.deleteTask);

app.get('/phases/last', phases.getLastPhaseId);
app.post("/projects", projects.addProject);
app.delete('/projects', projects.deleteProject);
app.get('/phases', phases.getPhasesForId);
app.get("/settings", settings.getAllSettings);
app.post('/projects/update', (req, res) => {
	projects.deleteProject(req, res);
	projects.addProject(req, res);
});
app.get('/others', projects.getOthers);
app.listen(port, () => {
	console.log("Server was started on 5354 port...");
});

module.exports.con = con;