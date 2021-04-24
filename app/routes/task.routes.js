module.exports = app => {
  const task = require("../controllers/task.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", task.create);

  // Retrieve all Tutorials
  router.get("/", task.findAll);

  // Retrieve all published Tutorials
  router.get("/published", task.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", task.findOne);

  // Update a Tutorial with id
  router.put("/:id", task.update);

  // Delete a Tutorial with id
  router.delete("/:id", task.delete);

  // Create a new Tutorial
  router.delete("/", task.deleteAll);

  app.use("/api/task", router);
};
