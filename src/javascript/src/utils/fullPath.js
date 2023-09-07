function fullPath(request) {
    return request.path + request.url.slice(request.path.length);
}

module.exports = { fullPath }