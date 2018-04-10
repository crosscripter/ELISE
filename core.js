"use strict"

/* =================================================== Common Helper Functions ================================================== */
// Wrapper around console.log (mainly for conciseness)
const log = output => console.log(output.toString())

// Imports the fs read/write file methods
const { readFileSync, writeFileSync } = require('fs')

// Wrappers around fs read/write to simplify and abstract away encoding
const read = path => readFileSync(path, 'utf8')
const write = (path, content) => writeFileSync(path, content, 'utf8')

// Utility function used by almost every mode in the engine.
// Produces a range from two integers (from and to) inclusive.
// Takes an optional by parameter as the step for each generation
const range = (from, to, by=1) => [...Array(to - from + 1).keys()].map((_, i) => i + from).filter(n => n % by == 0);

// Utility function to sum up an array of numbers
const sum = xs => xs.reduce((a, b) => a + b, 0)

// Utility function for a random number between min and max (inclusive)
const random = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Random utility function to choose random list item.
const choice = xs => xs[random(0, xs.length - 1)]

// Export common functions
module.exports = { log, read, write, range, sum, choice }
