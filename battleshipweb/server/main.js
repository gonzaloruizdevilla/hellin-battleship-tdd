/*jslint node: true */
'use strict';
var express = require('express'),
    routes = require('./routes'),
    app = express();

app.use(express.bodyParser());

app.get('/api/partida', routes.partida);
app.post('/api/:id/coloca', routes.coloca);
app.get('/api/:id/estado', routes.estado);
app.post('/api/:id/dispara', routes.dispara);

app.use(function (req, res) {
    res.json({'ok': false, 'status': '404'});
});

module.exports = app;