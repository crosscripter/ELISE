'use strict'

const {
    elise,
    atbash: { atbash, alphabets },
    gematria: { gematria },
    els: { search, sources },
    modules
} = require('../../elise')

const router = require('express').Router()

const route = (mode, ...params) => router.get(`/${mode}/*`, ({params}, res, next) => {
    let parms = params[Object.keys(params)[0]].split('/').filter(x => x)
    elise(mode, ...parms).on('message', msg => res.json(msg))
})

modules.forEach(m => route(m))
module.exports = router;
