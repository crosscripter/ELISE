const { log, time, timeEnd } = console
const { factors } = require('./factors')

const prime = n => n >= 2 && factors(n).length == 1

const primes = n => {
  let i = 3
  let a = [2]
  while (a.length < n) {
    if (prime(i)) a.push(i)
    i++
  }
  return a
}

const primeAt = n => primes(n)[n - 1]
const primeIndex = n => !prime(n) ? 0 : primes(n).indexOf(n) + 1

module.exports = { prime, primes, primeAt, primeIndex }

if (require.main === module) {
  const n = parseInt(process.argv.slice(2)[0], 10)
  time('primes')
  log('=', primes(n).join(','))
  log('#', primeAt(n))
  timeEnd('primes')
}
