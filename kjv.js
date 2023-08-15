const { log } = console
const { readFileSync } = require('fs')

const file = readFileSync('./kjv.txt', 'utf8')

const parse = v => {
  const [book, chapter, verse, text] = v.replace(/^([\w\d]+) (\d+):(\d+)(.*?)$/, '$1|$2|$3|$4').split('|')
  return {book, chapter: +chapter, verse: +verse, text: text.trim() }
}

const lines = file.split(/\r\n|\r|\n/g).filter(Boolean)
const verses = lines.map(parse)
const books = Array.from(new Set(verses.map(({ book }) => book)))

const book = b => verses.filter(({ book }) => book == b)
const chapter = (b, c) => book(b).filter(({ chapter }) => chapter == c)
const chapterCount = (b) => book(b).pop().chapter

const verse = (b, c, v) => chapter(b, c).find(({ verse }) => verse == v)
const verseCount = (b, c) => chapter(b, c).pop().verse

const ref = ({ book, chapter, verse }) => `${book} ${chapter}:${verse}`
const text = (p) => p.map(({text}) => text).join('\n')

const passage = (b, c, v, B, C, V) => {
  const f = verse(b, c, v)
  const fi = verses.indexOf(f)
  const t = verse(B, C, V)
  const ti = verses.indexOf(t)
  return verses.slice(fi, ti + 1)
}

const OT = passage('Ge', 1, 1, 'Mal', 4, 6)
const NT = passage('Mt', 1, 1, 'Re', 22, 21)
const law = passage('Ge', 1, 1, 'De', 34, 12)

const clean = t => strip(t).toUpperCase().trim()
const strip = (t, re=/[^a-z]/gi) => t.replace(re, '')
const letters = t => strip(t).split('')
const words = t => strip(t, /[^ a-z]/gi).split(/ /g)

const search = (term, passage=verses, cased=false) => {
  const re = new RegExp(`${term}`, 'g' + (!cased ? 'i' : ''))
  log(re)
  const hits = passage.filter(v => re.test(v.text))
  return hits
}

module.exports = { 
  book, 
  chapter, 
  chapterCount, 
  verse, 
  verses,
  verseCount, 
  ref, 
  text, 
  passage, 
  OT, 
  NT, 
  law, 
  letters, 
  words, 
  search 
}
