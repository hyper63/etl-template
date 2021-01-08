const { asyncFetch, toJSON } = require('./utils')

module.exports = ({source, source_token}) => 
  asyncFetch(`${source}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${source_token}`
    }
  }).chain(toJSON)
