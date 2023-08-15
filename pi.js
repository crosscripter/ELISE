const { log, time, timeEnd } = console

// Unbounded Spigot Algorithm
// http://www.cs.ox.ac.uk/jeremy.gibbons/publications/spigot.pdf
const PI = function* () {
  let q = 1n
  let r = 180n
  let t = 60n
  let i = 2n

  while (true) {
    let digit = ((i * 27n - 12n) * q + r * 5n) / (t * 5n)
    yield Number(digit)
    let u = i * 3n
    u = (u + 1n) * 3n * (u + 2n)
    r = u * 10n * (q * (i * 5n - 2n) + r - t * digit)
    q *= 10n * i * (i++ * 2n - 1n)
    t *= u
  }
}

const pi = n => {
  const ds = []
  const gen = PI()
  while (ds.length < n + 1) ds.push(gen.next().value)
  const [p, ...dp] = ds
  return `${p}.${dp.slice(0, n).join('')}`
}

const piAt = (i, n) => pi(n)[i + 1]

const pindex = (t) => {
   let index = -1
   let digits = ''
   const gen = PI()
   let dc = 0
   let blk = 10000
   while (index == -1) {
     if (digits.length > blk) { dc++; digits = '' }
     digits += gen.next().value
     index = digits.indexOf(t)
   }

   return (blk * dc) + index
}

module.exports = { PI, pi, piAt, pindex }

if (require.main === module) {
  const n = parseInt(process.argv.slice(2)[0], 10)
  time('pi')
  log(pi(n))
  timeEnd('pi')
  // log('=', piAt(n, n))
}
