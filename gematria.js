"use strict"
const { log, read, range, sum } = require("./core")

/* ================== GEMATRIA / ISOPSEPHY ================== 
Gematria is the ancient practice of adding up the letters of a word
based on a letter/value key. For example, in both the Hebrew and Greek 
alphabets the letters are have numeric values.  There are different keys
for the different alphabets/languages.  The English gematria key used is
King Agrippa's Key.  The Hebrew gematria key is the standard (non-final)
key.  The Greek is also the standard key.

The keys are built up programmatically using numeric ranges converted into
the equivalent character.  Also input is normalized (Greek diacritics are
stripped, case is converted to upper (if applicable), final/sofit forms of
the Hebrew letters are converted to medial forms and the masoretic vowel/accent
as well as grammatical points (maqef, daggesh etc.) are stripped out as well.

Examples:

    J (600) + E (5) + S (90) + U + (200) + S (90) = 985    
    Ἰ (10) + η (8) + σ (200) + ο (70) + ῦ (400) + ς (200) = 888
*/

// Builds up an alphabet (combination of letters/characters) from a specific UTF codepoint offset
// for a given length.  For example: A (65) thru Z would be: 1 - 26 with an offset of 64 (64 + 1 = 'A')
const alphabet = (length, offset) => range(1, length).map(n => String.fromCodePoint(n + offset))

// Filters out specific indices from a given list.
const except = (list, indices) => list.filter((_, n) => indices.indexOf(n) == -1)

// TODO: is there a better functional way to do this?
// Zips two lists together into a single object.
const zip = (ks, vs) => ks.reduce((o, k, n) => {o[k] = vs[n]; return o;}, {})

// Creates a Gematria value key by flattening individual numeric ranges into a single range.
const key = ranges => ranges.reduce((a, b) => a.concat(range(b[0], b[1], b[2] || 1)), [])

// Preset Gematria keys by alphabet/language
const keys = {
    english: zip(alphabet(26, 64), key([[1,9],[600,600],[10,90,10],[100,200,100],[700,700],[900,900],[300,500,100]])),
    hebrew: zip(except(alphabet(27, 1487), [10,13,15,19,21]), key([[1,9],[10,90,10],[100,400,100]])),
    greek: zip(except(alphabet(25, 912), [17]), key([[1,5],[7,9],[10,80,10],[100,800,100]]))
}

// Strips diacritical marks from Greek, normalizing the accented characters and final characters to medial forms.
const unaccent = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// Cleans all characters from text that are not Greek, Hebrew or Latin letters
// Removes vowel points and grammatical marks in addition as well.
const clean = text => text.replace(/[^A-ZΑ-Ωא-ת]/g, '')

// Normalizes text by cleaning and unaccenting the text given.
const normalize = text => clean(unaccent(text.toUpperCase()))

// Split a given text up by words
const words = text => text.split(' ').filter(x => x)

// Calculate the gematria value of a given word based on the given key.
// NOTE: All letters not found in the key are assigned the value 0 by default.
const value = (word, key) => sum(normalize(word).split('').map(c => key[c] || 0))

// Detects the language and corresponding key name based on the word given.
const lang = word => Object.keys(keys).find(k => Object.keys(keys[k]).indexOf(normalize(word[0])) !== -1)

// Main function, given a word, auto detects key to use and calculates the corresponding gematria value.
const gematria = word => value(word, keys[lang(word)])

module.exports = { gematria, normalize, words, alphabet, lang }

// Unit testing
if (require.main != module) return
log("============== GEMATRIA ================")
const { chapter, text, WLC } = require("./sources")

let verses = chapter('Ge 1', WLC).map(text)
verses.forEach(v => log(words(v).map(w => `${w} (${gematria(w)})`).join(' '), '=', gematria(v)))
log('TOTAL: ', gematria(verses.join('')))

let ws = ["JESUS", "יֵשׁוּעַ", "Ἰησοῦς"]
ws.map(w => log(w, "=", gematria(w)))
