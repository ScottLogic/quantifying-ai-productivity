function fullPath(request) {
    return request.path + request.url.slice(request.path.length);
}

modules.export = { fullPath }