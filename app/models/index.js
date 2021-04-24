const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.category = require("./category.model.js")(mongoose);
db.task = require("./task.model.js")(mongoose);

module.exports = db;
