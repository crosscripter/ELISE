/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/factors.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

/**
 * Checks if n is a factor of f 
 * @param {number} n The n number to check for factor of f
 * @param {number} f The factor f to check for number n
 * @returns true if n is a factor of f
 */
const factor = (n, f) => n % f == 0 ? n / f : false

/**
 * Returns the first n factors of n
 * @param {number} n The max number of factors 
 * @returns The first n factors of n
 */
const factors = n => {
  const fs = []
  for (let i = 1; i <= n; i++) {
    const f = factor(n, i)
    if (f) fs.push([n / f, f])
  }
  return fs.slice(0, Math.ceil(fs.length / 2))
}

module.exports = { factor, factors }