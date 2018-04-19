const { 
  elise, 
  atbash: { atbash, alphabets }, 
  gematria: { gematria },
  els: { search, sources }
} = require('../../elise')

const { Router } = require('express')
const router = Router()

router.get('/', (req, res, next) => res.render('index', { title: 'ELISE' }))

// Creates a route based on the Elise module/mode and it's parameters
// /<mode>/<params..>
// /atbash/:text etc.
const route = (mode, ...params) => router.get(
  `/${mode}/${params.map(k => `:${k}`).join('/')}`,
  ({params}, res, next) => {
    let parms = Object.keys(params).map(k => params[k]).filter(p => p)
    console.log(`PARMS: ${parms}`)

    elise(mode, ...parms).on('message', msg => { 
        console.log(`RECVD: ${msg}`); 
        res.send(msg.toString()) 
      })
  }
)

// atbash/:text/:alphabet?
route('atbash', 'text', 'alphabet?')

// router.get('/gematria/:text', (req, res) => res.send(gematria(req.params.text).toString()))
route('gematria', 'text')

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
