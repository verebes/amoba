var express = require('express');

module.exports = function( app ) {
    'use strict';

    var router = express.Router();

    router.get("/test", function( req, res ) {
        res.send("hello world");
    });

    router.get("/greetings", function( req, res ) {
        res.send( "hello: " + req.body.name ) ;
    });

    app.use('/api', router);

}
