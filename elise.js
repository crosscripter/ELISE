/**
 * ELISE :: Version 2.1.0
 * 
 * File:    elise.js
 * Created: 2023-10-09
 * Author:  Michael Schutt (@crosscripter)
 * Usage:   A library of functions to explore 
 *          codes in the Bible programmatically
 * (C) Copyright Michael Schutt, 2023-2024. No Rights Reserved.
 * All Glory to God our Father and the Lord Jesus Christ
 */

const { log } = require('./core/logger')
const { load } = require('./core/loader')
const { clean } = require('./core/utils')

/* ELS Sequencing */
const KJV = require('./kjv/kjv')
const { skip } = require('./els/els')

/* Mathematical */
const { pi } = require('./math/pi')
const { E, PI, PHI, places, digitAt, indexOf } =require('./math/constants')
const { prime, primes, primeAt, primeIndex } = require('./math/primes')
const { factor, factors, factorAt, factorIndex } = require('./math/factors')
const { triangle, triangles, triangleAt, triangleIndex, triangular } = require('./math/triangles')

// Loader
log('KJV total chars: ', load('./kjv/kjv.txt').length)

// KJV
log('KJV total verse count: ', KJV.verses.length)
log('chapters in Genesis: ', KJV.chapterCount('Ge'))
log(`Gen 1:3 is "${KJV.verse('Ge', 1, 3).text}"`)
log(`Gen 1:1-1:3 is "${KJV.text(KJV.passage('Ge', 1, 1, 'Ge', 1, 3))}"`)
log(`NT verse count`, KJV.NT.length)
log(`Exodus verse count: `, KJV.book('Ex').length)
log('Searched "earnest" in NT:\n\n', KJV.text(KJV.search('earnest', KJV.NT)))

// ELS
log('\n\nKJV text skipping every 777 chars: ', skip(clean(KJV.text(KJV.verses)), 777).join(''))

// E
log('e to 5 digits: ', places(E, 5))
log('e to 50 digits: ', places(E, 50))
log('the 50th digit of e is: ', digitAt(E, 50))
log('digit 9 is found at index of e: ', indexOf(E, 9))

// PI
log('PI to 1000 places (constant)', places(PI, 1000))
log('PI to 1000 places (calculated)', pi(1000))
log('PI to 5 digits: ', places(PI, 5))
log('the 1st digit of PI is: ', digitAt(PI, 1))
log('digit 7 is found at index of PI: ', indexOf(PI, 7))

// PHI
log('PHI to 1000 places (constant)', places(PHI, 1000))
log('PHI to 5 digits: ', places(PHI, 5))
log('the 1st digit of PHI is: ', digitAt(PHI, 1))
log('digit 7 is found at index of PHI: ', indexOf(PHI, 7))

// Primes
log('7 is prime?', prime(7))
log('1 is prime?', prime(1))
log('first 10 primes', primes(10).join(','))
log('77th prime: ', primeAt(77))
log('389 is prime # : ', primeIndex(389))

// Factors
log('490 is a factor of 7?', factor(490, 7))
log('940 is a factor of 7?', factor(940, 7))
log('Factors of 490: ', factors(490))

// Triangular numbers
log('19 is a triangular number?: ', triangular(19))
log('6 is a triangular number?: ', triangular(6))
log('1st triangular number: ', triangle(1))
log('77th triangular number: ', triangle(77))
log('first 10 triangular numbers:', triangles(10))
log('77th triangular number is:', triangleAt(77))
log('3003 is triangular number #:', triangleIndex(3003))
log('50,005,000 is a triangular number?', triangular(50005000))

