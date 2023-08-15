const { log, time, timeEnd } = console
const { readFileSync } = require('fs')

const skip = (s, n) => {
    if (n == 1) return s.split('')
    const q = []
    const l = s.length
    for (let i = 0; i < l; i += n) q.push(s[i])
    return q
}

const clean = s => s.replace(/[^a-z]/gi, '').toUpperCase().trim()

const kjv = () => {
    const text = readFileSync('C:\\users\\cross\\OneDrive\\Documents\\KJV.txt', 'utf8')
    const lines = text.split(/\r\n|\r|\n/g).filter(Boolean)
    const verses = lines.map(line => line.replace(/^[\d\w]+ \d+:\d+ (.*?)$/, '$1'))
    return clean(verses.join(' '))
}

const KJV_LEN = 3_227_581
const s = kjv() 
log(`${s.length} character string generated: ${s.substring(0, 100) + '...'}`)

const start = 0
const end = KJV_LEN
const from = 1
const to = end
const min = 3

time('all')
for (let i = start; i <= end; i++) {
    const ss = s.slice(i, end)
    if (ss.length <= min) break
    
    for (let n = from; n <= to; n++) {
        const lbl = `${n}/${to}@${i}`
        time(lbl)
        const g = skip(ss, n)
        // console.clear()
        log(g.slice(0, end).join(' '))
        timeEnd(lbl)
        if (g.length <= min) break 
    }
}
timeEnd('all')
