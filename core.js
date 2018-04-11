"use strict"

/* =================================================== Common Helper Functions ================================================== */
// Wrapper around console.log (mainly for conciseness and pretty printing)
const log = (...outputs) => console.log(...outputs.map(o => typeof(o) == "object" ? JSON.stringify(o) : o))

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

// Export common functions
module.exports = { log, read, write, range, sum }

// Unit testing
if (require.main != module) return
log("=============== CORE ================")
const { KJV } = require("./sources")
const { random, choice } = require("./random")

log(1)
log(1, 2)
log([1, 2])
log({x: 1, y: 2})
log(range(0, 10))
log(range(0, 100, 2))
log(KJV.substr(0, 1000))
write("test.txt", "This is a test")
log(sum(range(1,5)))
log(range(0, 10).map(n => random(0, 1)).join(''))
log(choice(range(0, 10)))
