'use strict'

/*==================================================================================================================================\
|                  E. L. I. S. E                                                                                                   |
| :: Equidistant Letter Interval Sequencing Engine ::                                                                              |
|                  Version 1.0.0                                                                                                   |
|      Copyright (R) @crosscripter, 2018-2019                                                                                      |
|                                                                                                                                  |
| Usage: $ node elise.js <mode:atbash|gematria|els|hnv|wheel> <parameters..>                                                       |
|                                                                                                                                  |
| =================== MODES ========================================================================================================
|                                                                                                                                  |
|  1. ATBASH  (Atbash Ciphering)                                                                                                   |
|  $ node elise.js atbash "Text to cipher" <key:ENG|LAT|HEB|GRK|"CUSTOMCIPHERKEY">                                                 |
|  /api/atbash?text="Text to Cipher"&key=ENG                                                                                       |
|  Runs the atbash cipher on the input text, using the given key, prints out the ciphered text.                                    |
|                                                                                                                                  |
|  2. GEMATRIA (Hebrew Gematria/Greek Isopsephy)                                                                                   |
|  $ node elise.js gem "Word or phrase" [<key:ENG|LAT|HEB|GRK|{"Custom":0}>]                                                       |
|  /api/gematria?text="Word of Phrase"&key=LAT                                                                                     |
|  Sums up a given word or phrase using the Gematria value key given, prints out the word and value.                               |
|                                                                                                                                  |
|  3. ELS (Equidistant Letter Sequencing)                                                                                          |
|  $ node elise.js els "path/to/source.txt" "terms,to,sarch,for" [minSkip:0] [maxSkip:L] [start:0] [stop:L] ["path/to/grid.html"]  |
|  /api/els?source="path/to/source.txt"&terms="terms,to,search,for"&minSkip=0&maxSkip=10&start=1&stop=1000&grid="grid.html"        |
|  Runs ELS sequencing on the source text from star to stop, skipping from min to maxSkip looking for terms.                       |
|  Exports a list of hits and an optional HTML grid file (Defaults to ./grid.html)                                                 |
|                                                                                                                                  |
|  4. HNV (Log(N) Hebrew Numeric Value Linear Correlation)                                                                         |
|  $ node elise.js hnv "word=value,wordN=valueN;group2=value,group2=value,group2=value" "unit name" ["path/to/graph.html"]         |
|  /api/hnv?inputs="word=value,wordN=valueN"&unit=KM&graph="graph.html"                                                            |
|  Runs Dr. Haim Shore's HNV Linear Correlation between the unit values and the HNV (Gematria) values on the scale of Log(N).      |
|  Graphs the corresponding datapoints and calculates the correlation using the Pearsons Moment-Product Correlation Coefficent.    |
|  Exports the correlation graph to the path given.                                                                                |
|                                                                                                                                  |
|  5. WHEEL (Bible Wheel KeyLink Search)                                                                                           |
|  /api/wheel?terms="Words,to,search,for"                                                                                          |
|  $ node elise.js wheel "Words,to,Search,For"                                                                                     |
|  Models the Bible Wheel structure and searches across spokes/cycles and letter symbolism for keylinks.                           |
|  Displays results in a list on the screen.                                                                                       |
|                                                                                                                                  |
\=================================================================================================================================*/

// Run all modules and test them!
const { log } = require("./core")
const { parse } = require("path")
const { readdirSync } = require('fs')
const { fork } = require("child_process")
const thisFile = parse(__filename).base

const isModule = file => /\.js$/.test(file) && file != thisFile
const isMode = module => !["core", "random", "sources"].includes(module)
const modules = readdirSync(".").filter(isModule).map(m => parse(m).name)
modules.forEach(m => module.exports[m] = require(`./${m}`))

if (require.main != module) return

const usage = `usage: $ node elise.js <mode:${modules.map(m => parse(m).name).filter(isMode).join('|')}> <parameters..>`
let process_argv = ['node', 'elise.js', 'els', "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "2", "ACE", "20"]
let [_, __, mode, ...params] = process_argv

if (!modules.includes(mode)) { log(usage); process.exit(1) }
fork(`${mode}.js`, params)

let test = () => modules.forEach(m => fork(m))
// test()
