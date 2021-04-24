const db = require("../models");
const Task = db.task;
const {GoogleCalendar} = require("../../GoogleCalendar");
const { task } = require("../models");

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

class PlanController {
  constructor() {}

  async getPlan(req, res) {
    const { whenStart, categoriesTimeDeclaration } = req.query;
    if (!this.isValid(whenStart, categoriesTimeDeclaration)) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    const categoriesWithtasks = await this.getCategoriesWithTasks(
      req,
      res,
      categoriesTimeDeclaration
    );

    const categoriesWithTasksDependsOnRemainingTime = this.getCategoriesWithTasksDependsOnRemainingTime(
      categoriesWithtasks
    );

    const categoriesWithTasksWithBreakes = this.getCategoriesWithTasksWithBreakes(
      categoriesWithTasksDependsOnRemainingTime
    );
    const tasksList = this.getTasksList(categoriesWithTasksWithBreakes);

    const events = this.parseTasksToEvent(tasksList, whenStart);
    console.log(events);
    // this.sendEvents(events);
    // GoogleCalendar();
    res.status(200).send({events});
  }

  async getTasksForCategory(req, res, categoryId) {
    var condition = categoryId
      ? { categoryId: { $regex: new RegExp(categoryId), $options: "i" } }
      : {};
    return await Task.find(condition).catch((error) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks",
      });
    });
  }

  async getCategoriesWithTasks(req, res, categoriesTimeDeclaration) {
    return Promise.all(
      JSON.parse(categoriesTimeDeclaration).map(async (category) => {
        const tasks = await this.getTasksForCategory(req, res, category.category);
        return {
          category,
          tasks,
        };
      })
    );
  }

  getCategoriesWithTasksDependsOnRemainingTime(categoriesWithTasks) {
    return categoriesWithTasks.map((currentCategory) => {
      const { category, tasks } = currentCategory;
      let remainingTime = category.time;
      const tasksFitInRemainingTime = [];
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskTime > remainingTime) break;
        tasksFitInRemainingTime.push(tasks[i]);
        remainingTime -= tasks[i].taskTime;
      }
      return {
        category: category,
        tasks: tasksFitInRemainingTime,
      };
    });
  }

  getCategoriesWithTasksWithBreakes(categoriesWithTasksDependsOnRemainingTime) {
    return categoriesWithTasksDependsOnRemainingTime.map((currentCategory) => {
      const { category, tasks } = currentCategory;
      const tasksWithBreakes = [];
      tasks.forEach((task) => {
        if (!task.breakTime || !task.breakDelay) {
          tasksWithBreakes.push({ name: task.name, duration: task.taskTime });
          return;
        }
        const howManySplit = task.taskTime / (task.breakTime + task.breakDelay);
        for (let i = 1; i <= howManySplit; i++) {
          tasksWithBreakes.push(
            ...[
              { name: task.name, duration: task.breakDelay },
              { name: "Break", duration: task.breakTime },
            ]
          );
        }
      });
      return { category: category, tasks: tasksWithBreakes };
    });
  }

  getTasksList(categoriesWithTasksWithBreakes) {
    const tasksList = [];
    categoriesWithTasksWithBreakes.forEach((currentCategory) => {
      currentCategory.tasks.forEach((task) => {
        tasksList.push(task);
      });
    });
    return tasksList;
  }

  parseTasksToEvent(tasksList, whenStart){
    const currentTime = new Date(whenStart);
    return tasksList.map((task)=>{
      console.log(task.duration);
      const duration = task.duration / 60;
      const startTime = new Date(currentTime)
      const endTime = new Date(currentTime).addHours(duration);
      currentTime.addHours(duration);
      return {
        summary: task.name,
        start: {
          dateTime: startTime,
          timeZone: "+1",
        },
        end: {
          dateTime: endTime,
          timeZone: "+1",
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 10 }],
        },
      };
    })
  }

  sendEvents(event){
    event.forEach((event)=>{
      // GoogleCalendar(event);
    })
  }

  isValid(whenStart, categoriesTimeDeclaration) {
    return (
      whenStart &&
      categoriesTimeDeclaration &&
      categoriesTimeDeclaration.length > 0
    );
  }
}


// var event = {
//   summary: "Nauka słówek anglieskiego",
//   start: {
//     dateTime: new Date(2021, 2, 18, 21, 20, 0),
//     timeZone: "+1",
//   },
//   end: {
//     dateTime: new Date(2021, 2, 18, 21, 60, 0),
//     timeZone: "+1",
//   },
//   reminders: {
//     useDefault: false,
//     overrides: [{ method: "popup", minutes: 10 }],
//   },
// };
module.exports = { PlanController };
