'use strict'
const { log } = require("./core")

/* ======================================================= ATBASH Cipher ======================================================= 
Atbash is a simple cipher in which one transposes the given key such that the first and last letters are set equivalent, and the
second to last and second letter and so on etc.  So in the Latin/English key: A => Z and Z => A, B => Y and Y => B etc.  We see
an example of the latin key below:

                            1                    2
INDEX:  0 1 2 3 4 5 6 7 8 9 0 1 2  3 4 5 6 7 8 9 0 1 2 3 4 5
ENG:    A B C D E F G H I J K L M  N O P Q R S T U V W X Y Z
ATB:    Z Y X W V U T S R Q P O N  M L K J I H G F E D C B A
        
This transposition of the letters is equivalent and may be represented by the following function:

    N = (L - I) - 1

Where L is the length of the key
      N is the new index of a given character in the atbash tranposition
      I is the index of a given character in the key

Thus we encode the English text "Hello World!" as "SVOOL DLIOW!"
Therefore the character 'H' index is 7 and the equivalent atbash character is 'S'
Hence to transpose or encipher:

H at index 7 is 'H'

    L = 26 (Length of key, 0-25, but 26 characters total)
    N = (26 - 7) - 1 => (19) - 1 => 18

therefore, N at index 18 is 'S'
and to reverse the transposition or decipher:

S at index 18 is 'S'

    L = 26
    N = (26 - 18) - 1 => (8) - 1 => 7

Therefore, N at index 7 is 'H'
*/


// Predefined Atbash "Alphabets" or keys. 
// Two are defined for use, the English and Hebrew alphabets, respectively.
const alphabets = { 
    english: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 
    hebrew: "אבגדהוזחטיכלמנסעפצקרשת",
    greek: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
}

// Calculates the reverse index of a given character c within a given string of text, or key
const rindex = (c, key) => key.length - key.indexOf(c) - 1

// Formats the given text enciphers or transposes the text character by character using the Atbash cipher using the given key.
const atbash = (text, key) => text.toUpperCase().split("").map(c => key[rindex(c, key)] || c).join("")

module.exports = { atbash, alphabets }

// Unit testing
if (require.main != module) return
log("=============== ATBASH ================")

// English for my name
let eaword = "Michael Schutt"

// Hebrew phrase "Leb Kamai" found in Jeremiah
// which is Atbash enciphered text for "Chasdim" (or Chaldeans)
let haword = "לב קמי"

const { normalize } = require("./gematria")
let gword = normalize("Ἰησοῦς")

// Display the enciphered words
log(eaword, "=>", atbash(eaword, alphabets.english))
log(haword, "=>", atbash(haword, alphabets.hebrew))
log(gword, '=>', atbash(gword, alphabets.greek))
