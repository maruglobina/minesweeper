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
//add the router
app.use('/', router);

//controllers
var tableController = require(path.join(__dirname + '/controllers/tableController.js'));

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
  //__dirname : It will resolve to your project folder.
});


/*router.post('/table', function(req, res){
  var size = req.body.size;
  var bombs = req.body.bombs;

  res.render(path.join(__dirname + '/views/table.html'), {
    size: size,
    bombs: bombs,
  });

  res.end();
});*/

router.post('/table', tableController.new_game);

/*router.post('/table', 
    function(req, res, next){ 
      console.log('size ' + req.body.size);
      //var size = size;
      //var bombs = bombs;
      next()
    },
    tableController.new_game
);*/




app.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});