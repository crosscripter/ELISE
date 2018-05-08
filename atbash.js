'use strict'

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




const { argv, log } = require("./core")



// Predefined Atbash "Alphabets" or keys. Two are defined for use, the English and Hebrew alphabets, respectively.
const alphabets = {

    // English (Latin) alphabet A - Z
    english: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    // Hebrew Alefbet א-ת (Alef-Tav)
    hebrew: "אבגדהוזחטיכלמנסעפצקרשת",

    // Greek alphabeta Α-Ω (Alpha-Omega)
    greek: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
}


/** int rindex(char char, string string)
Summary: Calculates the reverse index of a given character within a given string of text.
Returns: The reverse index of the character in the string from the end instead as an int.

Example: 
> rindex('E', "ABCDEFG")
2

Equation:
R = (L - I) - 1

Where L is the length of the string
      I is the zero-based forward index of the character
      R is the zero-based reverse index of the character

Given the index of 'E' is 4

Index:   0 1 2 3 4 5 6
Chars:   A B C D E F G
RIndex:  6 5 4 3 2 1 0

Therefore a string having the length of 7 (L)
minus the forward index of 'E' at 4 (I) is 3
minus the offset of 1 or 2 the reverse index (R) of 'E'

L = 7
I = 4
R = (7 - 4) - 1
R = (3) - 1
R = 2
*/
const rindex = (char, string) => (string.length - string.indexOf(char)) - 1


/** string atbash(string text, string key)
Summary: Formats the given text enciphers or transposes the text character by character using the Atbash cipher using the given alphabetic key.
Returns: The atbashed enciphered text as a string

Example:
> atbash('ABC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
'ZYX'
*/
const atbash = (text, key) => text.toUpperCase().map(c => key[rindex(c, key)] || c).join("")


module.exports = { atbash, alphabets }


if (require.main != module) return

log("=============== ATBASH ================")
const { lang, normalize } = require("./gematria")
let args = argv()

if (args.length > 0) {
    let [ word, keyname ] = args
    let key = alphabets[keyname] || alphabets[lang(word)]
    log(`word='${word}', key='${key}'`)
    let result = atbash(normalize(word), key)
    return process.send({text: result, key: key})
}

let words = {
    // Hebrew word "Leb Kamai" in Jeremiah enciphered text for "Chasdim" the Chaldeans
    hebrew: "לב קמי",
    english: "Hello, World!",
    greek: "Ἰησοῦς"
}

words.map((k, v) => log(v, '=>', atbash(normalize(v), alphabets[k])))
