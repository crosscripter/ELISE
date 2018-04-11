"use strict"
const encoding = "utf8"

const { EOL } = require("os")
const { log, read, write } = require("./core")

// const read = path => readFileSync(path, encoding)
// const write = (path, text) => writeFileSync(path, text, encoding)
const source = version => read(`./sources/${version}.txt`)

const KJV = source('KJV')
const WLC = source('WLC')
const STR = source('STR')

const single = xs => xs[0]
const last = xs => xs[xs.length - 1]

const unique = list => {
    var r = [];
    for (let item in list) {
        item = list[item]
        if (!~r.indexOf(item)) r.push(item)
    }
    return r;
}

const format = /^([A-Z1-3]{2,4}) (\d+)\:(\d+)(.*)$/gi
const lines = text => text.split(new RegExp(EOL, 'g'))
const reference = line => line.replace(format, '$1 $2:$3')
const match = (lines, find) => lines.filter(l => new RegExp(`^${find}`, 'i').test(l))
const matchLines = (source, pattern) => match(lines(source), pattern)

const unitalicize = text => text.replace(/\[(.*?)\]/g, '$1')
const text = verse => unitalicize(verse.replace(reference(verse), '').trim())
const verse = (ref, version) => single(matchLines(version, `^${ref} `))
const chapter = (ref, version) => matchLines(version, `${ref}\:`)
const book = (ref, version) => matchLines(version, `${ref} `)

const rbook = ref => ref.replace(format, '$1')
const books = unique(lines(KJV).map(l => rbook(reference(l))))
const OTBooks = books.filter((_, n) => n < 39)
const NTBooks = books.filter((_, n) => n >= 39)

const originalSource = ref => OTBooks.includes(rbook(ref)) ? WLC : STR
const original = ref => verse(ref, originalSource(ref))

module.exports = { 
    KJV, 
    WLC, 
    STR, 
    reference, 
    lines,
    text, 
    verse, 
    chapter, 
    book, 
    books,
    OTBooks, 
    NTBooks, 
    original
}

// Unit testing
if (require.main != module) return
log("=============== SOURCES ==================")

let ls = lines(KJV)
let r = reference(ls[0])
log(r)

log(verse('GE 1:1', KJV))
log(chapter('GE 1', KJV))
log(book('GE', KJV).length)

log(verse('GE 1:1', WLC))
log(chapter('GE 1', WLC))
log(book('GE', WLC).length)

log(verse('Mt 1:1', STR))
log(chapter('Mt 1', STR))
log(book('Mt', STR).length)

let kg11 = verse('GE 1:2', KJV)
let wg11 = verse(reference(kg11), WLC)
log(text(kg11), wg11)

log(OTBooks)
log(NTBooks)

log(original('Ge 1:1'))
log(original('Mt 1:1'))
