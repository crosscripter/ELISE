'use strict'

/* Common Helpers */
const log = console.log
const { readFileSync, writeFileSync } = require('fs')
const read = path => readFileSync(path, 'utf8')
const write = (path, content) => writeFileSync(path, content, 'utf8')
const range = (from, to, by=1) => [...Array(to - from + 1).keys()].map((_, i) => i + from).filter(n => n % by == 0);


/* ATBASH Cipher */
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

/* Gematria/Isopsephy */
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



/* ELS Sequencing */
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














/* HNV Linear Correlation */
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

let iceCreamSales = {
    temps: [14.2, 16.4, 11.9, 15.2, 18.5, 22.1, 19.4, 25.1, 23.4, 18.1, 22.6, 17.2],
    sales: [215, 325, 185, 332, 406, 522, 412, 614, 544, 421, 445, 408]
}

// log(correlate(iceCreamSales.temps, iceCreamSales.sales))
plot(toHNVdata(diameters, diametersEng))
