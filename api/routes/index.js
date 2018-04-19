
const { atbash, alphabets } = require("../../atbash")
const { gematria } = require("../../gematria")
const { search, sources } = require('../../els')

const { Router } = require('express')
const router = Router()

router.get('/', (req, res, next) => res.render('index', { title: 'ELISE' }))
router.get('/atbash/:text/:alphabet?', ({params: {text, alphabet}}, res) => res.send(atbash(text, alphabets[alphabet || 'english'])))
router.get('/gematria/:text', (req, res) => res.send(gematria(req.params.text).toString()))

// router.get('/els/:source/:minskip?/:maxskip?/:start?/:stop?/:terms/:grid?', (req, res, next) => {
router.get('/els/:source/:interval/:term/:gridWidth?', (req, res, next) => {
  let { source, interval, term, gridWidth=0 } = req.params
  let sourceText = sources[source]
  sourceText = sourceText.substr(5)
  // search(G.substr(5), 50, "תורה", 38).substr(0, 500)
  // localhost:3000/els/G/50/תורה/
  let grid = search(sourceText, parseInt(interval, 10), term, parseInt(gridWidth, 10)).replace(/\[(.*?)\]/g, '<b>$1</b>')
  grid = grid.substr(0, 500)
  res.render('grid', { grid })
})

module.exports = router
