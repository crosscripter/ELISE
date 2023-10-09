/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/pi.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

/* Regexes */
REGEX_NON_LETTERS = /[^a-z]/gi

/**
 * Cleans a text string by stripping special chars
 * uppercasing and trimming text of whitespace. 
 * @param {string} t The text to clean
 * @returns The cleaned text as a string
 */
const clean = t => strip(t).toUpperCase().trim()

/**
 * Strips chars from text t using regexp re
 * @param {string} t The text to strip chars from
 * @param {RegExp} re The regular expression of remove chars
 * @returns The text with the chars in re removed
 */
const strip = (t, re=REGEX_NON_LETTERS) => t.replace(re, '')

module.exports = { clean, strip }
