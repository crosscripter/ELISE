const { time, timeEnd } = console
const { verses } = require('../kjv/kjv')
const { log } = require('../core/logger')
const { clean } = require('../core/utils')

/**
 * 
 * @param {string} s String of text to sequence
 * @param {number} n The skip interval to skip (every nth char)
 * @returns The generated sequence of skipped chars as string
 */
const skip = (s, n) => {
    if (n == 1) return s.split('')
    const q = []
    const l = s.length
    for (let i = 0; i < l; i += n) q.push(s[i])
    return q
}

module.exports = { skip }
if (require.main !== module) return

/* Constants */
const KJV_LEN = 3_227_581

// Load KJV
const s = clean(verses.map(({ text }) => text).join(' '))
log(`${s.length} character string generated: ${s.substring(0, 100) + '...'}`)

// Search
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
        log(g.slice(0, end).join(' '))
        timeEnd(lbl)
        if (g.length <= min) break 
    }
}
timeEnd('all')
