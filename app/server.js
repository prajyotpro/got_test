var cluster     = require('cluster'); // Only required if you want the worker id
var sticky      = require('sticky-session');
var config      = require('./config/app');


var http        = require('http');
var express     = require('express');
var app         = express();


var server      = require('http').createServer(app);
var io          = require('socket.io')(server);


// Application port
var port        = process.env.PORT || config.server.port;

var bodyParser  = require('body-parser');
var helmet      = require('helmet');
var multipart   = require('connect-multiparty');
var fs          = require('fs');


// Database configurations
var database    = require('./config/database');
database = database.getDatabase(process.env.NODE_ENV);

var mongoose    = require('mongoose');
// Make database connection and model setup
mongoose.connect('mongodb://'+database.username+':'+database.password+'@'+database.host+':'+database.port+'/'+database.database);
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


// ========================================== ROUTES ==========================================
var battleRouter               = require('../app/routes/battle');


//
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

}
