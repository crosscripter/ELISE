/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/pi.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

/**
 * Generator functin which yields the digits of PI in succession
 * using the Unbounded Spigot Algorithm: http://www.cs.ox.ac.uk/jeremy.gibbons/publications/spigot.pdf
 */
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

/**
 * Generates PI as a string containing n number of digits behind the decimal place 
 * @param {number} n The number of digits to generate
 * @returns A string with n number of digits of PI 
 */
const pi = n => {
  const gen = PI()
  const digits = []

  while (digits.length < n + 1) 
    digits.push(gen.next().value)
  
  const [prefix, ...restDigits] = digits
  return `${prefix}.${restDigits.slice(0, n).join('')}`
}

module.exports = { PI, pi }
