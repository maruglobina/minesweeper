const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.set('port', (process.env.PORT || port));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('static', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const router = express.Router();

app.use('/', router);

var tableController = require(path.join(__dirname + '/controllers/tableController.js'));

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/home', function(req, res){
  res.sendFile(path.join(__dirname + '/public/views/home.html'));
});

router.post('/table', tableController.new_game);

app.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});