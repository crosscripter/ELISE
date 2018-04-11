'use strict'

/*==================================================================================================================================\
|                  E. L. I. S. E                                                                                                   |
| :: Equidistant Letter Interval Sequencing Engine ::                                                                              |
|                  Version 1.0.0                                                                                                   |
|      Copyright (R) @crosscripter, 2018-2019                                                                                      |
|                                                                                                                                  |
| Usage: $ node elise.js <mode:ATB|GEM|ELS|HNV|BWH> <inputs..>                                                                     |
|                                                                                                                                  |
| =================== MODES ========================================================================================================
|                                                                                                                                  |
|  1. ATB  (Atbash Ciphering)                                                                                                      |
|  $ node elise.js ATB "Text to cipher" <key:ENG|LAT|HEB|GRK|"CUSTOMCIPHERKEY">                                                    |
|  Runs the atbash cipher on the input text, using the given key, prints out the ciphered text.                                    |
|                                                                                                                                  |
|  2. GEM (Hebrew Gematria/Greek Isopsephy)                                                                                        |
|  $ node elise.js GEM "Word or phrase" [<key:ENG|LAT|HEB|GRK|{"Custom":0}>]                                                       |
|  Sums up a given word or phrase using the Gematria value key given, prints out the word and value.                               |
|                                                                                                                                  |
|  3. ELS (Equidistant Letter Sequencing)                                                                                          |
|  $ node elise.js ELS "path/to/source.txt" "terms,to,sarch,for" [minSkip:0] [maxSkip:L] [start:0] [stop:L] ["path/to/grid.html"]  |
|  Runs ELS sequencing on the source text from star to stop, skipping from min to maxSkip looking for terms.                       |
|  Exports a list of hits and an optional HTML grid file (Defaults to ./grid.html)                                                 |
|                                                                                                                                  |
|  4. HNV (Log(N) Hebrew Numeric Value Linear Correlation)                                                                         |
|  $ node elise.js HNV "word=value,wordN=valueN;group2=value,group2=value,group2=value" "unit name" ["path/to/graph.html"]         |
|  Runs Dr. Haim Shore's HNV Linear Correlation between the unit values and the HNV (Gematria) values on the scale of Log(N).      |
|  Graphs the corresponding datapoints and calculates the correlation using the Pearsons Moment-Product Correlation Coefficent.    |
|  Exports the correlation graph to the path given.                                                                                |
|                                                                                                                                  |
|  5. BWH (Bible Wheel KeyLink Search)                                                                                             |
|  $ node elise.js BWH "Words,to,Search,For"                                                                                       |
|  Models the Bible Wheel structure and searches across spokes/cycles and letter symbolism for keylinks.                           |
|  Displays results in a list on the screen.                                                                                       |
|                                                                                                                                  |
\=================================================================================================================================*/

// Import transformation modules
const { log, range, read, write } = require("./core")
const { random, choice, permute } = require("./random")
const { KJV, STR, WLC, original } = require("./sources")
const { atbash, alphabets } = require("./atbash")
const { gematria } = require("./gematria")
const { els } = require("./els")
const { plot } = require("./hnv")
const { wheel } = require("./wheel")

// Run all modules and test them!
const { fork } = require("child_process")
let modules = ["core", "random", "sources", "atbash", "gematria", "els", "hnv", "wheel"]
modules.forEach(m => fork(`./${m}`))
