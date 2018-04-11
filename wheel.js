"use strict"
const { log, range } = require("./core")
const { alphabets } = require("./atbash")
const { lines, verse, books, WLC, KJV } = require("./sources")
// const { lines, matchLines } = require("./els")

/* ================== BIBLE WHEEL ================== */
const letters = alphabets.hebrew.split('')

const wheel = range(0, 65).map(n => ({
    number: n + 1, 
    letter: letters[n % 22],
    book: books[n],
    spoke: (n % 22) + 1,
    cycle: Math.ceil((n + 1) / 22)
}))

const single = xs => xs[0] || null
const sliceBy = (slicer, prop, value) => wheel.filter(e => e[slicer] == value).map(e => e[prop])
const byBook = sliceBy.bind(this, 'book')
const bySpoke = sliceBy.bind(this, 'spoke')
const byCycle = sliceBy.bind(this, 'cycle')
const byLetter = sliceBy.bind(this, 'letter')

const spoke = spoke => single(byBook('spoke', spoke))
const cycle = cycle => single(byBook('cycle', cycle))
const letter = letter => single(byBook('letter', letter))

const spokeBooks = bySpoke.bind(this, 'book')
const cycleBooks = byCycle.bind(this, 'book')
const letterBooks = byLetter.bind(this, 'book')

const bookBy = (slice1, slice2, prop, value1, value2) => wheel.find(e => e[slice1] == value1 && e[slice2] == value2)[prop]
const bookBySpokeCycle = bookBy.bind(this, 'spoke', 'cycle', 'book')
const bookByLetterCycle = bookBy.bind(this, 'letter', 'cycle', 'book')
const otherSpokeBooks = book => spokeBooks(spoke(book)).filter(b => b != book)

const stripVowels = text => text.replace(/[^א-ת ]/g, '')
const ref = verse => verse.replace(/^([A-Z0-9]{2}) (\d+)\:(\d+)(.*)$/gi, "$1 $2:$3")
const findVerse = (verse, word) => new RegExp(` ${word} `).test(verse) ? ref(verse) : false

module.exports = { wheel, stripVowels }

// Unit testing
if (require.main != module) return
log("=============== BIBLE WHEEL ===========")

log(wheel)
log(spoke('Heb'))
log(cycle('Heb'))
log(spokeBooks(1))
log(letterBooks('ב'))
log(cycleBooks(3).toString())
log(otherSpokeBooks('Ro'))
log(bookBySpokeCycle(2, 3))
log(bookByLetterCycle('ב', 3))

log(verse('Ge 1:1', WLC))
log(verse('Ge 1:1', KJV))

let hw = stripVowels("בָּרָ֣א")
const hvs = lines(WLC).map(l => `${ref(l)}${stripVowels(l)}`)

const mhvs = hvs.map(v => ({h: v, r: findVerse(v, hw)}))
                .filter(x => x.r)
                .map(x => `${x.h}  ${verse(x.r, KJV)}`)

log(mhvs)
