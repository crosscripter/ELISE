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

const bitClass = bit => bit == '0' ? 'zero' : 'one'
const bitPixel = bit => `<div class='bit ${bitClass(bit)}'></div>`
const bitDivs = text => text.split('').map(bitPixel).join('')

const bitStyle = '<style>body{color:#000;}form{margin:10px 0;}.bit{float:left;width:8px;height:8px;border:1px solid transparent;-webkit-transition:border 500ms ease-out;-moz-transition:border 500ms ease-out;-o-transition:border 500ms ease-out;}.one{background:#000;}</style>'
const bitScript = '<script>$(function(){$("#toggleBorder").click(function(){var on=$(this).prop("checked");$(".bit").css("border", on ? "1px solid #eee":"1px solid transparent");});});</script>'
const bitControls = "<form><input type='checkbox' id='toggleBorder'><label for='toggleBorder'>Show Pixels</label></form>"
const bitHtml = text => `<!doctype html><html><head>${bitStyle}<script src="https://code.jquery.com/jquery.min.js"></script></head><body>${bitControls}<div id='bitImage'>${bitDivs(text)}</div>${bitScript}</body></html>`

module.exports = { sop, b2s, s2b, c2b, b2c, bitHtml }

// Unit testing
if (require.main != module) return
log("=========== BIN ============")
const { write } = require("./core")
const { normalize } = require("./gematria")
let args = argv()

if (args.length > 0) {    
    let [ text ] = args
    let result = bitHtml(s2b(normalize(text, false))) // sop(args, n => n + offset)
    write("../output/bits.html", result)
    return process.send(`/bits.html?text=${text}`)
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

let html = bitHtml(b)
write("../output/bits.html", html)
