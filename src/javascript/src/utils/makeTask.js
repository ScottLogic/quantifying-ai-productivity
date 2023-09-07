const { makeTimestamp } = require("./makeTimestamp");
const { v4: uuidv4 } = require('uuid')

function makeTask(name, description) {
    return {
        "uuid": uuidv4(),
        "name": name,
        "description": description,
        "created": makeTimestamp(),
        "completed": null,
        "complete": false
    }
}

module.exports = { makeTask }