const bodyParser = require("body-parser");
const express = require("express");
// const session = require("express-session");
const mysql = require("mysql");
const { DBConfig } = require("./config");
const projects = require('./server/route/projects');
const users = require("./server/route/users");
const settings = require("./server/route/settings");
const roles = require("./server/route/roles");
const tasks = require("./server/route/tasks");
const phases = require("./server/route/phases");
// const multer = require("multer");
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
// app.use("/server", express.static("node_modules"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(session({
// 	secret: "replace this string... k12jh40918e4019u3",
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { maxAge: 60 * 60 * 1000 }
// }));


// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "./uploads/");
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, "img-" + Date.now() + ".jpg");
// 	}
// });
// const upload = multer({ storage: storage });

// app.post("/server/avatar", upload.single("upload"), users.addAvatarFile);
app.get("/projects", projects.getProjects);

app.get("/login", users.login);
// app.post("/server/login/status", users.loginStatus);
// app.post("/server/logout", users.logout);
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
// app.put("/server/users/:id", users.editData);
// app.post("/server/users", users.addData);
// app.delete("/server/users/:id", users.deleteUser);

// app.post("/server/suppliers", suppliers.addNewSupplier);
app.get("/settings", settings.getAllSettings);
app.post('/projects/update', (req, res) => {
	projects.deleteProject(req, res);
	projects.addProject(req, res);
});
app.get('/others', projects.getOthers);
// app.put("/server/suppliers/:id", suppliers.updateSupplier);

// app.get("/server/goods_categories", goods.getAllCategories);
// app.post("/server/goods_categories", goods.addCategory);
// app.delete("/server/goods_categories/:id", goods.deleteCategory);
// app.post("/server/goods", goods.addGood);
// app.put("/server/goods/:id", goods.updateGoodInformation);
// app.get("/server/goods", goods.getAllGoods);
// app.get("/server/goods/:id", goods.getGood);
// app.get("/server/good/:id", goods.getGoodForId);

// app.post("/server/proposals", proposals.addProposal);
// app.get("/server/proposals", proposals.getAllProposals);
// app.put("/server/proposals/:id", proposals.updateProposal);

// app.post("/server/realize_report", reports.addRealizeReport);
// app.get("/server/realize_report", reports.getAllRealizeReport);
// app.get("/server/realize_group_report", reports.getAllGroupRealizeReport);

// app.get("/server/registration_report", reports.getAllRegistrationReport);

app.listen(port, () => {
	console.log("Server was started on 5354 port...");
});

module.exports.con = con;