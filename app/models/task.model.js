module.exports = mongoose => {
  var schema = mongoose.Schema({
    categoryId: String,
    name: String,
    taskTime: Number,
    description: String,
    breakDelay: Number,
    breakTime: Number,
  });

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Task = mongoose.model("task", schema);
  return Task;
};
