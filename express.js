const Promise = require('bluebird')
const lodash = require('lodash')
const moment = require('moment')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token')
const path = require('path')

const EXPRESS_PORT = process.env.EXPRESS_PORT || process.env.PORT || 4500

module.exports = function (actions) {

    const app = express() // run express instance
    const server = require('http').createServer(app) // run the server

    app.set('showStackError', false)
    if (process.env.NODE_ENV === 'development') {
        app.set('showStackError', true)
        // Prettify HTML
        app.locals.pretty = true
    }

    app.use('/static', express.static('./static'))

    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(bodyParser.json({ limit: '50mb' }))

    app.use(bearerToken())
    app.use(cors())
    app.use(cookieParser())

    app.get('*', (req, res) => {
        // res.sendFile(path.join(__dirname + '/dist/index.html'));
        res.sendFile(path.resolve('index.html'))
        const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        console.log(process.env.EXPRESS_PORT + ' - Express:', ip)
        // res.json({
        //     token: req.token,
        //     success: true,
        //     ip: ip
        // })
    })

    // 404 error handle
    app.use((req, res) => res.status(404).send('[404] Something broke!'))

    // 500 error handle
    app.use((err, req, res, next) => {
        console.error(err.stack || err.message || err)
        res.status(500).send(err.message || err)
    })

    server.listen(EXPRESS_PORT, () => {
        console.log('Express server started on port:', EXPRESS_PORT)
    })

    return app
}
