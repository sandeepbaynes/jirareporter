var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
var cors = require('cors');
var cookieparser = require('cookie-parser');

var testconnectionaction = require('./actions/testconnection.js');
var loginaction = require('./actions/logintojira.js');
var getcurrentuseraction = require('./actions/getcurrentuser.js');
var suggestionsaction = require('./actions/autocompletesuggestion.js');
var getsprintsdataaction = require('./actions/getsprintsdata.js');

var app = express();
app.use(cors({ credentials: true, origin: config.get('authorizedsite') }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.port = process.env.PORT || config.get('port');

//Init UI files
app.use('/css', express.static(`${__dirname}/ui/css`));
app.use('/js', express.static(`${__dirname}/ui/js`));
app.use('/fonts', express.static(`${__dirname}/ui/fonts`));
app.use('/', express.static(`${__dirname}/ui`));

this.cache = {};

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: `${__dirname}/ui` });
});

app.get('/test', (req, res) => {
    testconnectionaction.execute(res, req.cookies.jirasession, req.query.ticket);
});

app.post('/logintojira', (req, res) => {
    loginaction.execute(res, req.body.authcreds, req.body.user);
});

app.get('/currentuser', (req, res) => {
    getcurrentuseraction.execute(res, req.cookies.jirasession);
});

app.get('/suggestions', (req, res) => {
    suggestionsaction.execute(res, req.cookies.jirasession, req.query.fieldname, req.query.fieldvalue);
});

app.get('/getsprintsdata', async (req, res) => {
    var sprintdata = await getsprintsdataaction.execute(req.cookies.jirasession, req.query.sprints);
    res.send(sprintdata);
});

const server = app.listen(app.port, function () {
    console.log(`Server started at port ${app.port}`);
});