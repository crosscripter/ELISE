const { Router } = require('express')
const router = Router()

const {
    elise,
    atbash: { atbash, alphabets },
    gematria: { gematria },
    els: { search, sources }
} = require('../../elise')

router.get('/', (req, res, next) => res.render('index', { title: 'ELISE' }))

const route = (action, mode, ...params) => router.get(
    `/${mode}/${params.map(k => `:${k}`).join('/')}`,
    ({ params }, res, next) => {
        let parms = Object.keys(params).map(k => params[k]).filter(p => p)
        elise(mode, ...parms).on('message', msg => action(res, msg))
    }
)

const textRoute = route.bind(this, (res, msg) => res.send(msg.toString()))
const renderRoute = route.bind(this, (res, msg) => res.render(msg.view, msg.state))

textRoute('atbash', 'text', 'alphabet?')
textRoute('gematria', 'text')
renderRoute('els', 'source', 'start', 'interval', 'term')

module.exports = router;
