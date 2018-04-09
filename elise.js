'use strict'

/* Common */
const log = console.log
const { readFileSync, writeFileSync } = require('fs')
const read = path => readFileSync(path, 'utf8')
const write = (path, content) => writeFileSync(path, content, 'utf8')
const range = (from, to, by=1) => [...Array(to - from + 1).keys()].map((_, i) => i + from).filter(n => n % by == 0);


/* ================== ATBASH Cipher ================== */
const rindex = (c, key) => key.length - key.indexOf(c) - 1
const atbash = (text, key) => text.toUpperCase().split("").map(c => key[rindex(c, key)] || c).join("")

const alphabets = {
  english: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  hebrew: "אבגדהוזחטיכלמנסעפצקרשת"
}

log("================ ATBASH ====================");
let eaword = "Michael Schutt"
let haword = "לב קמי"
log(eaword, "=>", atbash(eaword, alphabets.english))
log(haword, "=>", atbash(haword, alphabets.hebrew))



/* ================== GEMATRIA / ISOPSEPHY ================== */
const alphabet = (length, offset) => range(1, length).map(n => String.fromCodePoint(n + offset))
const except = (list, indices) => list.filter((_, n) => indices.indexOf(n) == -1)
const zip = (ks, vs) => ks.reduce((o, k, n) => {o[k] = vs[n]; return o;}, {})
const key = ranges => ranges.reduce((a, b) => a.concat(range(b[0], b[1], b[2] || 1)), [])

const keys = {
    latin: zip(alphabet(26, 64), key([[1,9],[600,600],[10,90,10],[100,200,100],[700,700],[900,900],[300,500,100]])),
    hebrew: zip(except(alphabet(27, 1487), [10,13,15,19,21]), key([[1,9],[10,90,10],[100,400,100]])),
    greek: zip(except(alphabet(25, 912), [17]), key([[1,5],[7,9],[10,80,10],[100,800,100]]))
}

const sum = xs => xs.reduce((a, b) => a + b, 0)
const unaccent = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const clean = text => text.replace(/[^A-ZΑ-Ωא-ת]/g, '')
const normalize = text => clean(unaccent(text.toUpperCase()))
const value = (word, values) => sum(normalize(word).split('').map(c => values[c] || 0))
const lang = word => Object.keys(keys).find(k => Object.keys(keys[k]).indexOf(normalize(word[0])) !== -1)
const gematria = word => value(word, keys[lang(word)])

log("================ GEMATRIA ====================");
// let gtext = read("GE1.txt")
// let verses = gtext.split(/\r\n/g)
// verses.forEach(v => { log(v.split(/ /g).map(w => `${w} (${gematria(w)})`).join(' '), '=', gematria(v)) })
// log('==', gematria(gtext))

let twords = ["JESUS", "יֵשׁוּעַ", "Ἰησοῦς"]
twords.map(w => log(w, "=", gematria(w)))



/* ================== EQUIDISTANT LETTER SEQUENCING ================== */
const reverse = text => text.split('').reverse().join('')
const els = (text, skip) => text.split('').filter((_, n) => n % skip == 0).join('')
const sequence = text => range(1, text.length - 1).map(n => ({skip: n, text: els(text, n)}))
const find = (text, term) => range(0, text.length - 1).filter(n => text.indexOf(term, n) == n)

const search = (text, term) => sequence(text)
    .map(s => ({seq: s, indices: find(s.text, term)}))
    .filter(s => s.indices.length > 0)
    .map(s => `Skipping ${s.seq.skip} at ${s.indices} in ${s.indices.map(i => s.seq.text.substr(i - 10, i + 10)).join(',')}`)

const lines = path => read(path).split(/\r\n/g)
const unpoint = text => text.replace(/[^א-ת]/g, '')
const unfinalize = text => {
    const finals = {'ך':'כ', 'ם':'מ', 'ן':'נ', 'ף':'פ', 'ץ':'צ'}
    Object.keys(finals).forEach(s => { text = text.replace(new RegExp(s, 'g'), finals[s]); })
    return text
}

const format = text => unfinalize(unpoint(text))
const text = lines => lines.map(format).join('')
const matchLines = (lines, pattern) => lines.filter(l => pattern.test(l))
const book = book => matchLines(lines("WLC.txt"), new RegExp(`^${book}`))
const chapter = (book, chapter) => matchLines(lines("WLC.txt"), new RegExp(`^${book} ${chapter}\:`))

log("================ ELS ====================");
let terms = ["ACE"]
let stext = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" // read("GE1.txt", "utf8").replace(/[^A-Z]/gi, '').toUpperCase()
let seq = sequence(stext)[1].text
log(`Term ${terms[0]} found in sequence ${seq.substr(0, 30)}... at index ${find(seq, terms[0])}`)

const G = text(book("GE"))
const I53 = text(chapter("ISA", 53))

// GE 1 (5) x 50 = תורה
log ('Genesis chapter 1, starting at the 6th letter, skipping every 50 letters:', 
els(G.substr(5), 50).substr(0, 4))

// ISA 53 (507) x 20 = ישוע שמי
log('Isaiah chapter 53, starting at the 508th letter, skpping every 20 letters:', 
els(reverse(I53.substr(0, 507)), 20).substr(0, 7))


/* ================== LOG(N) HNV LINEAR CORRELATION ================== */
const logn = value => Math.log(value)
const mean = ns => sum(ns) / ns.length

const correlate = (x, y) => {
    const mx = mean(x)
    const my = mean(y)
    const a = x.map(n => n - mx)
    const b = y.map(n => n - my)
    const ab = a.map((n,i) => n * b[i])
    const a2 = a.map(n => n ** 2)
    const b2 = b.map(n => n ** 2)
    const sab = sum(ab)
    const sa2 = sum(a2)
    const sb2 = sum(b2)
    return sab / Math.sqrt(sa2 * sb2)
}

const plot = data => { write("data.js", data); log(data); }
const dataList = inputs => inputs.map(i => [logn(gematria(i.word)), logn(i.value), i.trans, i.word, gematria(i.word)])
const clist = a => [a.map(t => t[0]), a.map(t => t[1]) ]

const toHNVdata = (...inputs) =>
    `HNV_DATA=[${inputs.map(input => {
        const dlist = dataList(input).sort((a, b) => a[0] - b[0])
        const [glist, plist] = clist(dlist)
        const lc = correlate(glist, plist)
        const lcp = `${(lc * 100).toFixed(4)}%`
        const label = `${input.map(i => `${i.word} (${gematria(i.word)})`).join(', ')} = Linear Correlation of ${lcp}`
        return `{data:${JSON.stringify(dlist)},label:"${label}"}`
    })}]`

log("================ HNV ====================");
let diameters = [
    {word: "ירח", trans: "Moon", value: 1738.1},
    {word: "ארצ", trans: "Earth", value: 6378.137},
    {word: "שמש", trans: "Sun", value: 1392000.0},
]

let diametersEng = [
    {word: "Moon", trans: "Moon", value: 1738.1},
    {word: "Earth", trans: "Earth", value: 6378.137},
    {word: "Sun", trans: "Sun", value: 1392000.0}
]

// plot(toHNVdata(diameters, diametersEng))


/* ================== BIBLE WHEEL ================== */
const letters = alphabets.hebrew.split('')

const books = [
    "GEN","EXO","LEV","NUM","DEU",
    "JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST",
    "JOB","PSA","PRO","ECC","SOS",
    "ISA","JER","LAM","EZE","DAN",
    "HOS","JOE","AMO","OBA","JON","MIC","NAH","HAB","ZEP","HAG","ZEC","MAL",
    "MAT","MAR","LUK","JOH",
    "ACT","ROM",
    "1CO","2CO",
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

// log(wheel)
log(spoke('HEB'))
log(cycle('HEB'))
log(spokeBooks(1))
log(letterBooks('ב'))
log(cycleBooks(3).toString())
log(otherSpokeBooks('ROM'))
log(bookBySpokeCycle(2, 3))
log(bookByLetterCycle('ב', 3))

const ref = verse => verse.replace(/^([A-Z0-9]{2}) (\d+)\:(\d+)(.*)$/gi, "$1 $2:$3")
const findVerse = (verse, word) => verse.indexOf(word) != -1 ? ref(verse) : false
const verseByVersion = (ref, version) => matchLines(lines(`${version}.txt`), new RegExp(ref + ' ', 'i'))

// log(verseByVersion('GE 1:1', 'WLC'))
// log(verseByVersion('GE 1:1', 'KJV'))

// let w = "בָּרָ֣א"
// const vs = lines("WLC.txt").map(l => `${ref(l)} ${l}`)
// const mvs = vs.filter(v => findVerse(v, w))
