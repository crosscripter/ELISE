/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/triangles.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */


/**
 * Returns the first n triangular numbers
 * @param {number} n The number of triangular numbers 
 * @returns The first n triangular numbers as number[]
 */
const triangle = n => n * (n + 1) / 2

const triangles = (n) => {
  const ts = [] 
  for (let i = 1; i <= n; i++) ts.push(triangle(i))
  return ts
}

/**
 * Checks if number n is a triangular number  
 * @param {number} n The number to check for triangularity
 * @returns true if n is a triangular number
 */
const triangular = n => {
  let i = 0
  let t = 0
  const ts = []

  while (t < n) {
    t = triangle(++i)
    ts.push(t)
  }

  return ts.includes(n)
}

/**
 * Returns the nth triangular number 
 * @param {number} n The nth triangular number
 * @returns The nth triangular number 
 */
const triangleAt = n => triangles(n).pop()

/**
 * Finds the index of number n within list of all triangular numbers
 * @param {number} n The number to find the index of in all triangular numbers
 * @returns The index of number n within list of all triangular numbers
 */
const triangleIndex = n => triangles(n).indexOf(n) + 1


module.exports = { triangle, triangular, triangles, triangleAt, triangleIndex }
