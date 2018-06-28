import * as mongoose from 'mongoose'
import * as requireDirectory from 'require-directory'
// const requireDirectory = require('require-directory')

let schemas = requireDirectory(module)

const map = Object.keys(schemas).reduce((map, name) => {
  const schema = schemas[name]
  const className = name.charAt(0).toUpperCase() + name.slice(1)
  return Object.assign(map, {
    [className]: mongoose.model(className, schema)
  })
}, {})

export default map
