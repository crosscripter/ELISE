"use strict"
const { log, read, choice } = require("./core")
const { normalize } = require("./gematria")

// Calculates all indices of a given term in a given text
const indicesOf = (text, term) => text
    .split('')
    .map((_, n) => text.substr(n))
    .map((s, n) => s.substr(0, term.length) == term ? n : -1)
    .filter(x => x != -1)

// Skips a given number of letters (skip) in a given text building a skip text sequence.
const skip = (text, skip) => text.split('').filter((c, x) => x % skip == 0 ? c : '').join('')

// Calculates the all the letter indices of a given word at a given index with a given skip.
const skipIndices = (word, index, skip) => word.split('').map((_, n) => (n + index) * skip)

// Flattens an array of arrays into a single array
const flatten = aas => aas.reduce((a, b, _, r) => a.concat(...b), [])

const grid = (text, indices, width=0) => text
    .split('')
    .map((c, n) => ~indices.indexOf(n) ? `[${c}]` : ` ${c} `)
    .map((c, n) => n % width == 0 ? `\n${c}` : c)
    .join('')

const search = (text, interval, term) => {
    let source = normalize(text)    
    let seq = skip(source, interval)
    let ns = indicesOf(seq, term)
    let iis = ns.map(n => skipIndices(term, n, interval))
    let fs = flatten(iis)
    return grid(source, fs, 30)
}

let text = read("KJV.txt").substr(0, 1000)
log(search(text, 3, "HE"))
