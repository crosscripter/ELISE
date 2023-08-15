const { readFileSync } = require('fs')
const { log, time, timeEnd } = console

const e = a => {
  const digits = readFileSync('e.txt', 'utf8')
  return `2.${digits.slice(2, a + 2)}`
}

if (require.main === module) {
  const n = parseInt(process.argv.slice(2)[0], 10)
  time('e')
  log(e(n))
  timeEnd('e')
}