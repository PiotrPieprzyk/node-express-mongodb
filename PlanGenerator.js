class PlanGenerator {
  constructor(tasks, timeForCategories) {
    this.tasks = tasks;
    this.timeForCategories = timeForCategories;
  }

  getPlan(req, res) {
    const plan = [];
    this.timeForCategories.forEach((category) => {
      const tasksForCategory = this.getTasksForCategory(category);
      console.log("tasksForCategory ", tasksForCategory);
      const tasksDependsOnRemainingTime = this.getTasksDependsOnRemainingTime(
        tasksForCategory,
        category
      );
      console.log("tasksDependsOnRemainingTime ", tasksDependsOnRemainingTime);
      plan.push(...this.getTasksWithBreakes(tasksDependsOnRemainingTime));
    });
    return plan;
  }

  getTasksForCategory(category) {
    return this.tasks.filter((task) => task.categoryId === category.id);
  }

  getTasksDependsOnRemainingTime(tasks, category) {
    let remainingTime = category.time;
    const tasksFitInRemainingTime = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskTime > remainingTime) break;
      tasksFitInRemainingTime.push(tasks[i]);
      remainingTime -= tasks[i].taskTime;
    }
    return tasksFitInRemainingTime;
  }

  getTasksWithBreakes(tasks) {
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
    return tasksWithBreakes;
  }
}

exports.module = {
  PlanGenerator,
};
