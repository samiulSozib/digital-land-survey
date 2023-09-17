const express = require('express')
const morgan = require('morgan')
const flash = require('connect-flash')



const middlewares = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    flash()
]

module.exports = (app) => {
    middlewares.forEach(m => {
        app.use(m)
    })
}