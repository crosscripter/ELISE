/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/primes.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

const { factors } = require('./factors')

/**
 * Returns true if n is a prime number
 * @param {number} n The number to check for primeness
 * @returns true if n is a prime  number
 */
const prime = n => n >= 2 && factors(n).length == 1

/**
 * Finds first n number of primes
 * @param {number} n The number of primes to return
 * @returns The first n number of primes as an array of number
 */
const primes = n => {
  let i = 3
  let primes = [2]
  while (primes.length < n) {
    if (prime(i)) primes.push(i)
    i++
  }
  return primes 
}

/**
 * Find the nth prime number
 * @param {number} n The nth number of primes to find
 * @returns The nth prime number
 */
const primeAt = n => primes(n)[n - 1]

/**
 * Returns the index of n within the list of primes
 * @param {number} n The number to find in the list of primes
 * @returns The index of prime number n within list of primes
 */
const primeIndex = n => !prime(n) ? 0 : primes(n).indexOf(n) + 1

module.exports = { prime, primes, primeAt, primeIndex }