const test = require('tape')
const fetchMock = require('fetch-mock')

// do fetchMock here:
fetchMock
  .get('begin:https://ads.example.com/reports/get', {
    status: 200,
    body: [ 
      {
        "click_cnt": 0.0,
        "stat_datetime": "2021-01-05 16:00:00",
        "show_uv": 0.0,
        "stat_cost": 0.0,
        "show_cnt": 0.0
      }
    ]
  })
  .put('begin:https://api.ignite-board.com/data/dev', {
    status: 200,
    body: {
      ok: true
    }
  })


const { createPipeline, extract, transform, load, report } = require('./index')

const config = {
  source: 'https://ads.example.com/reports/get',
  source_token: '1234',
  target: 'https://api.ignite-board.com/data/dev',
  target_token: '12345'
}

test('success run pipeline', async t => {
  const pipeline = createPipeline(config)

  const result = await pipeline(
    extract,
    transform,
    load,
    report
  )

  console.log(result)

  t.ok(true)
  t.end()

})

