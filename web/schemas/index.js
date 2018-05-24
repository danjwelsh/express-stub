const mongoose = require('mongoose')
const requireDirectory = require('require-directory')

let schemas = requireDirectory(module)

module.exports = Object.keys(schemas).reduce((map, name) => {
  const schema = schemas[name]
  const className = name.charAt(0).toUpperCase() + name.slice(1)
  return Object.assign(map, {
    [className]: mongoose.model(className, schema)
  })
}, {})
