const { asyncFetch, toJSON } = require('./utils')

module.exports = ({target, target_token}) => doc =>
  asyncFetch(`${target}/${doc.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${target_token}`
    },
    body: JSON.stringify(doc)
  })
  .chain(toJSON)
