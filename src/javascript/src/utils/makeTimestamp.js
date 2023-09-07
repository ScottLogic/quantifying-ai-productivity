function makeTimestamp() {
    return new Date().toISOString();
}

module.exports = { makeTimestamp }