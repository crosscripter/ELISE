const { time, timeEnd, log } = console

const triangle = n => n * (n + 1) / 2

const triangles = (n) => {
  const ts = [] 
  for (let i = 1; i <= n; i++) ts.push(triangle(i))
  return ts
}

const triangleAt = n => triangles(n).pop()
const triangleIndex = n => triangles(n).indexOf(n) + 1

module.exports = { triangle, triangles, triangleAt, triangleIndex }

if (require.main === module) {
  const n = parseInt(process.argv.slice(2)[0], 10)
  time('triangles')
  log(triangles(n).join(','))
  timeEnd('triangles')
  log('=', triangleAt(n))
  log('#', triangleIndex(n))
}

