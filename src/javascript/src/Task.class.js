const UUID = require("./UUID.utility.js");
const Date = require("./Date.utility.js");

module.exports = class Task {
  static blankTask = new Task({
    uuid: "00000000-0000-0000-0000-000000000000",
    name: "Unknown Task",
    description: "Unknown Task",
    created: Date.fromEpochMs(0),
  });
  constructor({ uuid, name, description, created, completed, complete }) {
    this.uuid = uuid ?? UUID.new();
    this.name = name;
    this.description = description;
    this.created = created ?? Date.now();
    this.completed = completed ?? null;
    this.complete = complete ?? false;
  }
  markComplete() {
    this.completed = Date.now();
    this.complete = true;
  }
  isValid() {
    return this.name && this.description;
  }
};
