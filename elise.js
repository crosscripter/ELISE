'use strict'

/*========================================================================================
  
                          ▓█████  ██▓     ██▓  ██████ ▓█████ 
                          ▓█   ▀ ▓██▒    ▓██▒▒██    ▒ ▓█   ▀ 
                          ▒███   ▒██░    ▒██▒░ ▓██▄   ▒███   
                          ▒▓█  ▄ ▒██░    ░██░  ▒   ██▒▒▓█  ▄ 
                          ░▒████▒░██████▒░██░▒██████▒▒░▒████▒
                          ░░ ▒░ ░░ ▒░▓  ░░▓  ▒ ▒▓▒ ▒ ░░░ ▒░ ░
                          ░ ░  ░░ ░ ▒  ░ ▒ ░░ ░▒  ░ ░ ░ ░  ░
                          ░     ░ ░    ▒ ░░  ░  ░     ░   
                          ░  ░    ░  ░ ░        ░     ░  ░
                                                        
                                   Version 0.1.0.1
                    (Equidistant Letter Interval Sequencing Engine)
                        Copyright (R) Michael Schutt, 2018-2019

                  Usage: ENGINE  $ node elise.js <mode> <parameters...>
                         API     $ cd /elise/api && npm start

======================================= MODES ============================================

1. ATBASH :: Atbash Ciphering
$ node elise.js atbash "Text to cipher" <key:english|hebrew|greek|"CUSTOMCIPHERKEY">
/atbash/TEXT[/KEY]

Runs the atbash cipher on the input text, using the given key, prints out the ciphered text.

--------------------------------------------------------------------------------------------
2. GEMATRIA :: Hebrew Gematria/Greek Isopsephy
$ node elise.js gem "Word or phrase" [<key:ENG|LAT|HEB|GRK|{"Custom":0}>]
/gematria/TEXT[/KEY]

Sums up a given word or phrase using the Gematria value key given, prints out the word and value.

--------------------------------------------------------------------------------------------
3. ELS :: Equidistant Letter Sequencing
$ node elise.js els "path/to/source.txt" "terms,to,sarch,for" [minSkip:0] [maxSkip:L] [start:0] [stop:L] ["path/to/grid.html"]
/els/SOURCE/START/SKIP/TERM

Runs ELS sequencing on the source text from star to stop, skipping from min to maxSkip looking for terms.
Exports a list of hits and an optional HTML grid file (Defaults to ./grid.html)

--------------------------------------------------------------------------------------------
4. HNV :: Log(N) Hebrew Numeric Value Linear Correlation
$ node elise.js hnv "word=value,wordN=valueN;group2=value,group2=value,group2=value" "unit name" ["path/to/graph.html"]
/hnv/WORD1,WORD2,WORD3/TRANS1,TRANS2,TRANS3/UNIT/VALUE1,VALUE2,VALUE3

Runs Dr. Haim Shore's HNV Linear Correlation between the unit values and the HNV (Gematria) values on the scale of Log(N).
Graphs the corresponding datapoints and calculates the correlation using the Pearsons Moment-Product Correlation Coefficent.
Exports the correlation graph to the path given.

--------------------------------------------------------------------------------------------
5. WHEEL :: Bible Wheel KeyLink Search
$ node elise.js wheel "Words,to,Search,For"
/wheel/TERM

Models the Bible Wheel structure and searches across spokes/cycles and letter symbolism for keylinks.
Displays results in a list on the screen.

*/



const { log } = require("./core")
const { parse } = require("path")
const { readdirSync } = require('fs')
const { fork } = require("child_process")

// Auto-export all registered Elise modules
const thisFile = parse(__filename).base
const isModule = file => /\.js$/.test(file) && file != thisFile
const isMode = module => !["core", "random", "sources"].includes(module)
const modules = readdirSync("../").filter(isModule).map(m => parse(m).name)
modules.forEach(m => module.exports[m] = require(`./${m}`))

// Main elise entry point
const elise = (mode, ...params) => fork(`../${mode}.js`, params)

module.exports.elise = elise
module.exports.modules = modules

if (require.main != module) return

const usage = `usage: $ node elise.js <mode:${modules.map(m => parse(m).name).filter(isMode).join('|')}> <parameters...>`

// let process_argv = ['node', 'elise.js', 'els', "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "2", "ACE", "20"]
let process_argv = ['node', 'elise.js', 'atbash', 'XYZ']
let [_, __, mode, ...params] = process_argv

// Run each module in "test" mode
let test = () => modules.forEach(m => elise(m))

// Determine run state and run Elise
if (mode == 'test') test()
if (!modules.includes(mode)) { log(usage); process.exit(1) }
elise(mode, ...params)
