"use strict"
const { log, range, read } = require("./core")

/* ================== EQUIDISTANT LETTER SEQUENCING ================== 
Equidistant letter sequencing is the act of skipping equal number of letters
in a given text and saving the next letter, continuously to build a new text
from the saved letters.  In this new text, there seems to be a phenomenon known
simply as the "Bible Code", (as misnomer for certain, since there is multiple
Bible codes in reality).  The skipping of letters to reveal secrets was alluded
to be several great Rabbis of the past.  Certain key players uncovered these
hidden messages by hand without aid of a computer, such as Rabbi Weismandel who
painstakingly hand counted the letters to uncover the famous TORAH-YHVH-TORAH code
wherein, starting with the first Tav in the book of Genesis chapter 1, skipping every
50 letters spells out the word Torah () in Hebrew!  This happens again remarkably in 
the book of Exodus, and again only backwards in the books of Numbers and Deuteronomy!!
Then finally in the book of Leviticus it does not happen, instead skipping every 7
letters, one spells out the tetragrammaton the divine name of God YHVH.  So then the
Torah is a picture of the Torah always points to YHVH:

 GEN      EXO     LEV      NUM      DEU
TORAH => TORAH => YHVH <= HAROT <= HAROT

This remarkably points also to the form of the Menorah in which the left and right 
lamps were said to have pointed to the central Servant lamp.  After this, three key
researchers Dr. Eliyahu Rips, Doran Witzum and Joav Rosenberg published an article
in Statistical Science for peer review entitled "Equidistant Letter Sequences in the 
Book of Genesis" in which using the same method programmed a computer to search for
32 prominent rabbis along with their dates of birth/death.  The computer found them
all, encoded in the book of Genesis most encoded in a tight matrix with minimal skips.

Other claims, such as major world events have been found in ELS, along with relevant
dates, people, places and keywords.  "Hitler" "Nazi" and "Enemy" and the first SCUD
missle attack was found iwth "SADAM" "HUSSEIN" "PICKED A DAY" "SCUD" "MISSLE", as well
as the exact date (in the Hebrew calendar).  The impact of the Shoe-Maker-Levy comet
was predicted ahead of time as well as the assasination of the then prime minister of
Yitsach Rabin!

Finally there is evidence based on the work of Yacov Rambsel, that the name of the 
Messiah, Yeshua (Hebrew for Jesus) is found all throughout the old testament, in key
prophetic passages like ISA 53 where the phrase "MY NAME IS JESUS" is found. Or in
Pro 30:4 where it asked "what is his name, and WHAT IS HIS SONS NAME, surely you know?"
then encoded in the word "WHO" is the phrase "YESHUA (JESUS) IS THE GIFT".

These claims are incredible and this tool is an adaptation of the process used in the 
original SS article from Rips and his team. It is written to test these claims and to 
verify them.
*/

// Utility function to reverse a string of text
const reverse = text => text.split('').reverse().join('')

// Skips a given number of letters (skip) in a given text and returns the new text.
const skip = (text, skip) => text.split('').filter((_, n) => n % skip == 0).join('')

// Runs the skip sequence for a possible skips on a given text
// returns a list of sequences in the form {skip, text}
const sequence = text => range(1, text.length - 1).map(n => ({skip: n, text: skip(text, n)}))

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
const book = (book, version='WLC') => matchLines(lines(`${version}.txt`), new RegExp(`^${book}`, 'i'))
const chapter = (book, chapter, version='WLC') => matchLines(lines(`${version}.txt`), new RegExp(`^${book} ${chapter}\:`, 'i'))

// let terms = ["ACE"]
// let stext = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" // read("GE1.txt", "utf8").replace(/[^A-Z]/gi, '').toUpperCase()
// let seq = sequence(stext)[1].text
// log(`Term ${terms[0]} found in sequence ${seq.substr(0, 30)}... at index ${find(seq, terms[0])}`)

// const G = text(book("GE"))
// const I53 = text(chapter("ISA", 53))

// // GE 1 (5) x 50 = תורה
// log ('Genesis chapter 1, starting at the 6th letter, skipping every 50 letters:', 
// skip(G.substr(5), 50).substr(0, 4))

// // ISA 53 (507) x 20 = ישוע שמי
// log('Isaiah chapter 53, starting at the 508th letter, skpping every 20 letters:', 
// skip(reverse(I53.substr(0, 507)), 20).substr(0, 7))

module.exports = { skip, lines, matchLines, format }
