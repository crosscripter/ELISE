/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/loader.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

const { readFileSync } = require('fs')

// Loader default encoding
const ENCODING = 'utf8'

/**
 * Loads a text file at the given path as a string in ENCODING 
 * @param path The path of the file to load as text
 * @returns The contents of the file as a string
 */
const load = path => readFileSync(path, ENCODING)

module.exports = { load }
