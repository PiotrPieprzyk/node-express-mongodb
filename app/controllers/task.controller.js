const db = require("../models");
const Task = db.task;

// Create and Save a new Task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.taskTime || !req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Task
  const task = new Task({
    categoryId: req.body.categoryId,
    name: req.body.name,
    taskTime: req.body.taskTime,
    description: req.body.description,
    breakDelay: req.body.breakDelay,
    breakTime: req.body.breakTime,
  });

  // Save Task in the database
  task
    .save(task)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Task.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const categoryId = req.query.categoryId;
  var condition = categoryId
    ? { categoryId: { $regex: new RegExp(categoryId), $options: "i" } }
    : {};

  Task.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving category.",
      });
    });
};

// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Task.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Task with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Task with id=" + id });
    });
};

// Update a Task by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Task with id=${id}. Maybe Task was not found!`,
        });
      } else res.send({ message: "Task was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Task with id=" + id,
      });
    });
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Task.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Task with id=${id}. Maybe Task was not found!`,
        });
      } else {
        res.send({
          message: "Task was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Task with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Task.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Task.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.putTasksAtTheEndOfTheList = (tasks) => {
  Task.deleteMany({
    id: {
      $in: tasks.map((task) => task.id),
    },
  });
};
