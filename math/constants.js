/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/constants.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

const { load } = require('../core/loader')

/**
 * Loads a precalculated constant file a file
 * @param {string} name  The constant name to load
 * @returns The constant as a string value
 */
const constant = name => load(`./math/${name}.txt`)

/* Constants */
const E = constant('e')
const PI = constant('pi')
const PHI = constant('phi')

const places = (constant, n) => constant.slice(0, n + 2)
const digitAt = (constant, n) => constant[(n + 1) + 2]
const indexOf = (constant, n) => constant.indexOf(n) - 2

module.exports = { E, PI, PHI, places, digitAt, indexOf }
