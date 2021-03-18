const path = require('path');

var size = 0;
var bombs = 0;

exports.new_game = function(req, res, next) {
    size = req.body.size;
    bombs = req.body.bombs;

    //app.locals({ size: req.size, bombs: req.bombs });
    //drawTable();
    res.render(path.join('../views/table.html'));
};