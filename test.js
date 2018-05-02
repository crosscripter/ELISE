'use strict'
const log = console.log

const bitClass = bit => bit == '0' ? 'zero' : 'one'
const bitPixel = bit => `<div class='bit ${bitClass(bit)}'></div>`
const bitDivs = text => text.split('').map(bitPixel).join('')
const bitStyle = '<style>#bitImage{position:absolute;left:0;top:0;width:100% !important;height:100% !important;border:1px solid gray;}.bit{display:block;float:left;width:10px;height:10px;border:1px solid #eee;}.one{background:#000}</style>'
const bitHtml = text => `<!doctype html><html><head>${bitStyle}</head><body><div id='bitImage'>${bitDivs(text)}</div></body></html>`

const { write } = require("./core")
const bits = '10101001010101010101000010101010101010101011111010101011010101010101111010110101101101'
const html = bitHtml(bits)
write("C:/users/mikes/out.html", html)

