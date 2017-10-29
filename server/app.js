var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var app = express();
var WebSocket = require('ws');
var os = require('os');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// interceptor to filter out non application/json requests
app.use("/api/", function( req, res, next ) {
    var contentType = req.headers['content-type'];
    if (  !contentType || contentType.indexOf('application/json')  !==  0) {
        return res.sendStatus(400);
    }
    next();
});

var routes = require("./routes/routes.js")(app);

const server = http.createServer(app);
const wss = new WebSocket.Server( { server });

wss.on('connection', function(ws, req) {
    console.log('connection on websocket');
    // const location = url.parse(req.url, true);

    ws.on('message', function(data) {
        console.log(data);
        wss.clients.forEach( (client) => {
            if (client.readyState === WebSocket.OPEN) {
                console.log("sending data" + data);
                client.send( data  );
            }
        });
    });
});

server.listen(3000, function listening() {
    console.log("Listening on port %s ...", server.address().port);
});