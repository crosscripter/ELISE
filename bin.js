'use strict'
const { argv, log } = require("./core")

let zpad = b => Array(Math.abs(8 - b.length)).fill('0').join('') + b
let c2i = c => c.codePointAt(0)
let i2b = i => zpad(i.toString(2), 8)
let i2c = i => String.fromCodePoint(Math.abs(i))
let c2b = c => i2b(c2i(c))
let s2b = s => s.split('').map(c2b).join('')
let ba = bs => bs.split(/([01]{8})/g).filter(x => x)
let b2i = b => parseInt(b, 2)
let b2c = b => i2c(b2i(b))
let b2s = bits => ba(bits).map(b2c).join('')
let cop = (c, op) => i2c(op(c2i(c)))
let sop = (s, op) => s.split('').map(c => cop(c, op)).join('')

module.exports = { sop, b2s, s2b, c2b, b2c }

// Unit testing
if (require.main != module) return
log("=========== BIN ============")
let args = argv()

if (args.length > 0) {
    let { text, offset } = args
    let result = sop(args, n => n + offset)
    return process.send(result)
}

const { KJV, verse, text } = require("./sources")

let t = text(verse('Ge 1:1', KJV))
let o = 1405
let r = sop(t, n => n + o)
let b = s2b(t)
let strip = t => t.replace(/[^א-ת]/g, '').trim()
log(t)
log(b)
log('===========================================')
log(r)
log(s2b(r))
log(strip(r))
