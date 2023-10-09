/**
 * THIS FILE IS PART OF ELISE :: Version 2.1.0
 * 
 * File:      src/logger.js
 * Author:    Michael Schutt (@crosscripter)
 * Modified:  2023-10-09
 *
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

/**
 * Logs messages to the console from the ELISE modules 
 * @param  {...any} args Arguments to log
 * @returns void
 */
const log = (...args) => console.log('ELISE➤ ', ...args)

module.exports = { log }
