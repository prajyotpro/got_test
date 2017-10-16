var cluster     = require('cluster'); // Only required if you want the worker id
var sticky      = require('sticky-session');
var config      = require('./config/app');
// var models      = require('./models');


var http        = require('http');
var express     = require('express');
var app         = express();


var server      = require('http').createServer(app);
var io          = require('socket.io')(server);


var port        = process.env.PORT || config.server.port;


var bodyParser  = require('body-parser');
var helmet      = require('helmet');
// var path        = require('path');
// var multer      = require('multer');
var multipart   = require('connect-multiparty');

console.log(process.env.NODE_ENV);
var mongoose    = require('mongoose');

mongoose.connect('mongodb://arya:northremembers@ds153113.mlab.com:53113/gameofthrones');

var fs          = require('fs');
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


// ========================================== ROUTES ==========================================
var battleRouter               = require('../app/routes/battle');


if (!sticky.listen(server, port)) {

    // Master code
    server.once('listening', function () {


    });

} else {

    console.log("Worker %d is up and running..", cluster.worker.id);

    // Express server setup
    app.use(helmet());
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(multipart({
        uploadDir: config.tmp
    }));


    // ========================================== ROUTES ==========================================
    // API V1.0 Routes
    app.use('/',         battleRouter);


    // ========================================== SOCKET ==========================================
    var chat = io
        .of('/chat')
        .on('connection', function (socket) {
            console.log('Socket connected.');
            chat.emit('connected', { success: true });
        });
}
