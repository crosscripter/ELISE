/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/kjv.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

const { load } = require('../core/loader')

// KJV text
const KJV_PATH = './kjv/kjv.txt'
const file = load(KJV_PATH)
const REGEX_VERSE = /^([\w\d]+) (\d+):(\d+)(.*?)$/

/**
 * Parses a verse record from the KJV.txt and returns Ref typed object
 * @param {string} v The verse to parse
 * @returns A KJV Ref object of the form: { book, chapter, verse, text } 
 */
const parse = v => {
  const [book, chapter, verse, text] = v.replace(REGEX_VERSE, '$1|$2|$3|$4').split('|')
  return {book, chapter: +chapter, verse: +verse, text: text.trim() }
}

// All lines loaded from the KJV text file
const lines = file.split(/\r?\n/g).filter(Boolean)

// All verses as structured Ref objects 
const verses = lines.map(parse)

// All unique book names from KJV text file 
const books = Array.from(new Set(verses.map(({ book }) => book)))

/**
 * Returns all verses for a given book b
 * @param {string} b The name of the book to get all verses for
 * @returns All verses for a given book b
 */
const book = b => verses.filter(({ book }) => book == b)


/**
 * Returns a list of verse in book b chapter c
 * @param {string} b The book name
 * @param {number} c The chapter number
 * @returns Array of verses from book b and chapter c
 */
const chapter = (b, c) => book(b).filter(({ chapter }) => chapter == c)

/**
 * The number of chapters in book b 
 * @param {string} b The name of the book
 * @returns The number of chapters in book b
 */
const chapterCount = (b) => book(b).pop().chapter

/**
 * Returns the verse Object for book b, chapter c and verse v
 * @param {string} b The book name
 * @param {number} c The chapter number
 * @param {number} v The verse number
 * @returns The verse for book b, chapter c and verse v
 */
const verse = (b, c, v) => chapter(b, c).find(({ verse }) => verse == v)

/**
 * Returns the number of verses in a given chapter c of book b 
 * @param {string} b The book name
 * @param {number} c The chapter number
 * @returns The number of verses in a given chapter c of book b
 */
const verseCount = (b, c) => chapter(b, c).pop().verse

/**
 * Formats a Ref object into a string  
 * @param {Ref} ref The Ref object to format as a string 
 * @returns The traditinal string format for references: "book chap:verse"
 */
const ref = ({ book, chapter, verse }) => `${book} ${chapter}:${verse}`

/**
 * Returns the passage text of a given Passage p (Ref[])
 * @param {Ref[]} p The passage as an array of Ref objects
 * @returns The text of all the verses in the passage as a string
 */
const text = (p) => p.map(({text}) => text).join('\n')

/**b
 * Returns a passage of verse starting from book b c:v thru B C:V 
 * @param {string} b The from book name 
 * @param {number} c The from chapter number
 * @param {number} v The from verse number
 * @param {string} B The to book name
 * @param {number} C The to chapter number
 * @param {number} V The to verse number
 * @returns A Passage (Ref[]) of verses starting from book b:c - B C:V
 */
const passage = (b, c, v, B, C, V) => {
  const f = verse(b, c, v)
  const fi = verses.indexOf(f)
  const t = verse(B, C, V)
  const ti = verses.indexOf(t)
  return verses.slice(fi, ti + 1)
}

/* Predefined Passages */

// Old Testament (Gen 1:1 - Mal 4:6)
const OT = passage('Ge', 1, 1, 'Mal', 4, 6)
// New Testament (Mat 1:1 - Rev 22:21)
const NT = passage('Mt', 1, 1, 'Re', 22, 21)
// Law/Torah/Pentateuch (Gen 1:1 - Deu 34:12)
const law = passage('Ge', 1, 1, 'De', 34, 12)

/**
 * Returns the letters of a text as an array of chars
 * @param {string} t The text to get all letters from 
 * @returns The letters of a given text t as a string[]
 */
const letters = t => strip(t).split('')

/**
 * Returns the words of a text as an arary of strings
 * @param {string} t The text to return words from
 * @returns The words of a given text t as a string[]
 */
const words = t => strip(t, /[^ a-z]/gi).split(/ /g)

/**
 * Searches passage for term using case-insensitive search
 * unless cased is specified true
 * @param {string} term The term to search for
 * @param {Ref[]} passage The passage to search in
 * @param {boolean} cased flag to indicate case-sensitivity
 * @returns The search results as an Ref[] of verses
 */
const search = (term, passage=verses, cased=false) => {
  const re = new RegExp(`${term}`, 'g' + (!cased ? 'i' : ''))
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
