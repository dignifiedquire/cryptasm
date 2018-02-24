process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

setInterval(() => {
  process.stdout.write('.')
}, 50)

try {
  const a = require('./dist')
  const b = a()

  console.log('--', b)
} catch (err) {
  console.error('caught', err)
}
