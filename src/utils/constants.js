
module.exports.getServerUrl = function () {
    if(process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'development') {
        return 'http://localhost:8080';
    } else {
        return window.location.protocol + '//server.sweng500.com';
    }
}

module.exports.useCredentials = function () {
    return {withCredentials: true};
}

module.exports.isEmpty = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

