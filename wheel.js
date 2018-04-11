"use strict"
const { log, range } = require("./core")
const { alphabets } = require("./atbash")
const { lines, matchLines } = require("./els")

/* ================== BIBLE WHEEL ================== */
const letters = alphabets.hebrew.split('')

const books = [
    "GEN","EXO","LEV","NUM","DEU",
    "JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST",
    "JOB","PSA","PRO","ECC","SOS",
    "ISA","JER","LAM","EZE","DAN",
    "HOS","JOE","AMO","OBA","JON","MIC","NAH","HAB","ZEP","HAG","ZEC","MAL",
    "MAT","MAR","LUK","JOH",
    "ACT","ROM","1CO","2CO",
    "GAL","EPH","PHI","COL",
    "1TH","2TH","1TI","2TI","TIT",
    "PHL","HEB","JAM","1PE","2PE",
    "1JO","2JO","3JO","JUD","REV"
]

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
const verseByVersion = (ref, version) => matchLines(lines(`${version}.txt`), new RegExp(ref + ' ', 'i'))

module.exports = { wheel, stripVowels }

// Unit testing
if (require.main != module) return
log("=============== BIBLE WHEEL ===========")

log(wheel)
log(spoke('HEB'))
log(cycle('HEB'))
log(spokeBooks(1))
log(letterBooks('ב'))
log(cycleBooks(3).toString())
log(otherSpokeBooks('ROM'))
log(bookBySpokeCycle(2, 3))
log(bookByLetterCycle('ב', 3))

log(verseByVersion('GE 1:1', 'WLC'))
log(verseByVersion('GE 1:1', 'KJV'))

let hw = stripVowels("בָּרָ֣א")
const hvs = lines("WLC.txt").map(l => `${ref(l)}${stripVowels(l)}`)

const mhvs = hvs.map(v => ({h: v, r: findVerse(v, hw)}))
                .filter(x => x.r)
                .map(x => `${x.h}  ${verseByVersion(x.r, 'KJV')}`)

log(mhvs)
