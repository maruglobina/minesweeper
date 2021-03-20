const path = require('path');
const ejs = require('ejs');

exports.new_game = function(req, res, next) {
    var width = req.body.size;
    var bombs = req.body.bombs;
    res.render(path.join('../public/views/table.html'), {width: width, bombs: bombs});
};