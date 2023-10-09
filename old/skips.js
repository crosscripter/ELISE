// for with if
const skip1 = (s, n) => {
    let q = ''
    for (let i = 0; i < s.length; i++) {
        if (i % n === 0) q += s[i]
    }
    return q
} 

// for with index math
const skip2 = (s, n) => {
    let q = ''
    for (let i = 0; i < s.length; i += n) q += s[i]
    return q
}

// for with const length
const skip3 = (s, n) => {
    let q = ''
    let l = s.length
    for (let i = 0; i < l; i += n) q += s[i]
    return q
}

// Functional map 
const skip5 = (s, n) => s.split('').map((c, i) => i % n == 0 ? c : '').join('')

// functional reduce
const skip6 = (s, n) => s.split('').reduce((a, b, i) => a + (i % n == 0 ? b : ''), '')

// Functional Precalculated map
const skip7 = (s, n) => Array(s.length)
    .fill()
    .map((_, i) => i % n == 0 ? i : -1)
    .filter(x => x >= 0)
    .map(i => s[i])
    .join('')

// Functional precalculated reduce
const skip8 = (s, n) => Array(s.length)
    .fill()
    .map((_, i) => i % n == 0 ? i : -1)
    .filter(x => x >= 0)
    .reduce((a, b) => a + s[b], '')

const skip9 = (s, n) => {
    const q = []
    const l = s.length
    for (let i =0; i < l; i += n) q.push(s.slice(i, i+1))
    return q
}

const randstr = (s, len) => {
    return Array(len).join().split(',').map(() => s.charAt(Math.floor(Math.random() * s.length))).join('')
}

// const tests = [ skip1, skip2, skip3, skip4, skip5, skip6, skip7, skip8, skip9 ]

// tests.forEach((test, i) => {
//     const skip = `skip${i+1}`
//     time(skip)
//     test(s, n)
//     timeEnd(skip)
// })

