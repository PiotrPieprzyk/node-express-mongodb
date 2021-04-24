module.exports = (app) => {
  const { PlanController } = require("../controllers/plan.constroller");
  var router = require("express").Router();
  const plan = new PlanController();

  // Create a new Tutorial
  router.get("/", (req, res) => {
    plan.getPlan(req, res);
  });

  app.use("/api/plan", router);
};
