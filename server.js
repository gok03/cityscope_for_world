var cors = require('cors'),
	express = require('express'),
	session = require('express-session'),
	path = require('path'),
    logics = require(path.resolve( __dirname, "./logics.js" ));
var bodyParser = require('body-parser');
var app = express();  
app.use(cors());



app.configure(function () {
	app.use('/', express.static(__dirname + '/selector'));
	app.use('/backend', express.static(__dirname + '/backend/dist'));
	app.use('/scanner', express.static(__dirname + '/scanner/dist'));
	app.use('/matrix', express.static(__dirname + '/matrix/dist'));
	app.use('/matrixmini', express.static(__dirname + '/matrixmini/dist'));
	app.use('/viewer', express.static(__dirname + '/viewer'));
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());
    //app.use(bodyParser.json({limit: '50mb',extended: true, parameterLimit: 1000000}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 99999999999999999999999999999999999999999999999999999999999999999}));
    app.use(express.cookieParser());
});

app.get('/api/table/:name', logics.findbyname);
app.get('/api/tables/list', logics.showall);
app.post('/api/table/update/:name', logics.updatebyname);

app.listen(80,function(){
console.log('running');
});




// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(3000, function(){
//     console.log('Server running on 80...');
// });
