const { makeTimestamp } = require("./makeTimestamp")

function badRequest(path) {
    return {
        "timestamp": makeTimestamp(),
        "status": 400,
        "error": "Bad Request",
        "path": path
    }
}

module.exports = { badRequest }