const getData = require('./get-data.js') 
const putStats = require('./put-stats.js')


const { assoc, compose, concat, map } = require('ramda')
const pipeK = require('crocks/helpers/pipeK')
const Async = require('crocks/Async')
const ReaderT = require('crocks/Reader/ReaderT')
const AsyncReader = ReaderT(Async)
const { ask, lift } = AsyncReader
const { all } = Async

/**
 * creates a functional Async pipeline
 *
 * @param {Object} env
 * @returns {function} 
 */
exports.createPipeline = env => (...fns) =>
  pipeK(...fns)(AsyncReader.of())
    .runWith(env)
    .toPromise()

/**
 * extract
 *
 * This function connects to the source endpoints and requests
 * report data.
 *
 * @returns {AsyncReader}
 */
exports.extract = () => ask(getData).chain(lift)



const createId = doc => 
  assoc('id', `JOB_NAME:${doc.advertiserId}-${doc.stat_datetime}`,doc)

/**
 * transform
 *
 * takes a set of data and transforms the data in to target data
 *
 * @param {Array} data
 * @returns {AsyncReader}
 */
exports.transform = (data) => AsyncReader.of(
  map(
    compose( 
      assoc('type', 'JOB_NAME'),
      createId
    ),
    data
  )
)

/**
 * load
 *
 * puts stat data into data warehouse
 *
 * @param {Array} data
 * @returns {AsyncReader}
 */
exports.load = data => ask(({target, target_token}) => 
  all(
    map(putStats({target, target_token}), data)
  )
).chain(lift)

/**
 * report
 *
 * generates a safe console log reporting the
 * results
 *
 * @param {Array} results
 * @returns {AsyncReader}
 */
exports.report = results => {
  console.log(`Imported ${results.length} on ${new Date().toISOString()} for _____`)
  return AsyncReader.of(results.length)
}

