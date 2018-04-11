"use strict"
const { text } = require("./els")
const { log, range } = require("./core")
const { alphabets } = require("./atbash")
const { words, lang, alphabet } = require("./gematria")

// Utility function for a random number between min and max (inclusive)
const random = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Random utility function to choose random list item.
const choice = xs => xs[random(0, xs.length - 1)]

// Generate a random string of text a given length using the key provided.
const rstring = (length, key) => range(1, length).map(_ => choice(key.split(''))).join('')

// Shuffles a list of items into a random order
const shuffle = list => {
    let r = []
    let is = range(0, list.length - 1)

    while (r.length < is.length) {
        let c = choice(is)
        if (!~r.indexOf(c)) r.push(c)
    }

    return r.map(n => list[n])
}

// Shuffles a given text by word perserving word breaks.
const shuffleWords = text => shuffle(words(text)).join(' ')

// Permutes a given text preserving word breaks.
const permuteWords = text => words(text).map(w => rstring(w.length, alphabets[lang(w)])).join(' ')

// ASCII key for use in permutations
const ascii = alphabet(94, 32).join('')

// Generates a random bitstring of given size (defaults to 8).
const rbits = (size=8) => rstring(size, '01')

// Generates a random UTF-16 character
const rchar = () => String.fromCodePoint(parseInt(rbits(choice([8, 16])), 2))

module.exports = { random, choice, shuffle, shuffleWords, ascii, rchar, rbits }

// Unit testing
if (require.main != module) return
log("=============== RANDOM ==============")
const { lines } = require("./sources")

const { stripVowels } = require("./wheel")
let L1 = stripVowels(lines("WLC.txt")[0]).trim()
log(L1)
log(permuteWords(L1))
log(shuffleWords("This is an English Sentence!"))

const { WLC, chapter } = require("./sources")
let PG1 = chapter("Ge 1", WLC).map(l => stripVowels(l).trim()).filter((_, n) => n < 5)

log("-------- SHUFFLED --------")
log(PG1.map(shuffleWords).join(''))

log("-------- PERMUTED --------")
log(PG1.map(permuteWords).join(''))

log('-------- PASSWORDS --------')
let pws = range(1, 3).map(n => rstring(10, ascii))
log(pws.join('\n'))

log('-------- ASCII NOISE -------')
log(rstring(100, ascii))

log('-------- BINARY DIGITS ---------')
let bits = rbits(choice([8, 16, 32, 64]))
let rint = parseInt(bits, 2)
log('bits:', bits, 'int:', rint)

log('-------- UTF-16 NOISE ----------')
log(range(0, 100).map(_ => rchar()).join(''))
