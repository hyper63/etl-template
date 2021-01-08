const Async = require('crocks/Async')

exports.asyncFetch = Async.fromPromise(fetch)
exports.toJSON = res => Async.fromPromise(res.json.bind(res))()
