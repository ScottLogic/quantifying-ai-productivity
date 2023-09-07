function badRequest(path) {
    return {
        "timestamp": makeTimestamp(),
        "status": 400,
        "error": "Bad Request",
        "path": path
    }
}

function makeTimestamp() {
    return new Date().toISOString();
}

module.exports = { badRequest }