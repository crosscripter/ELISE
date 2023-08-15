const { log, time, timeEnd } = console

const factor = (n, f) => n % f == 0 ? n / f : false

const factors = n => {
  const fs = []
  for (let i = 1; i <= n; i++) {
    const f = factor(n, i)
    if (f) fs.push([n / f, f])
  }
  return fs.slice(0, Math.ceil(fs.length / 2))
}

module.exports = { factor, factors }

if (require.main === module) {
  const n = parseInt(process.argv.slice(2)[0], 10)
  time('factors')
  const fs = factors(n)
  timeEnd('factors')
  log(fs.map(([a,b])=>`${a}x${b}`).join(','))
}