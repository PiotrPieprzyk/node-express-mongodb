const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const { PlanGenerator } = require("./PlanGenerator").module;
const Category = db.category;
const Task = db.task;
const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const getPlan = async () => {
  const category = await Category.find({}).catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving category.",
    });
  });
  const tasks = await Task.find({}).catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving category.",
    });
  });

  const planer = new PlanGenerator(tasks, [
    {
      id: "605cd31be932e91f9c8d6f21",
      name: "English",
      time: 60,
    },
    {
      id: "605cd5b1e7c73d1c60e3f293",
      name: "Workout",
      time: 30,
    },
  ]);
  return planer.getPlan();
};

app.get("/getPlan", (req, res) => {
  console.log(getPlan);
  getPlan().then((data) => {
    res.json(data);
  });
});

require("./app/routes/category.routes")(app);
require("./app/routes/task.routes")(app);
require("./app/routes/plan.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
