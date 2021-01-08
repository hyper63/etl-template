globalThis.fetch = require('node-fetch')
const { createPipeline, extract, transform, load, report } = require('./lib')

// learn more about scheduled functions here: https://arc.codes/primitives/scheduled
exports.handler = async function scheduled (event) {
  console.log(JSON.stringify(event, null, 2))

  const config = {
    source: process.env.SOURCE_URL,
    source_token: process.env.SOURCE_TOKEN,
    target: process.env.TARGET_URL,
    target_token: process.env.TARGET_TOKEN
  }


  const pipeline = createPipeline(config)

  await pipeline(
    extract,
    transform,
    load,
    report
  )

  console.log('done')

  return
}
