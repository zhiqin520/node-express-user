var mysql = require('mysql');
var db = mysql.createConnection({
    host:     '127.0.0.1',
    user:     'root',
    password: '940327!',
    database: 'node_express_user'
});

module.exports = Entry;

function Entry(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

Entry.prototype.save = function(fn){
  var article = this;

    db.query(
        "INSERT INTO article (username, title, body) " +
        " VALUES (?, ?, ?)",
        [article.username, article.title, article.body],
        function(err) {
            if (err) throw err;
            fn(err);
        }
    );
};

Entry.getRange = function(from, perpage, fn){
    db.query(
        "SELECT * FROM article "
        + " LIMIT ?, ?",
        [from, perpage],
        function(err, rows) {
            if (err) throw err;
            fn(null, rows)
        }
    );
};


Entry.count = function(fn){
    var query = "SELECT count(*) as len FROM article ";
    db.query(
        query,
        function(err, res) {
            if (err) throw err;
            fn(err, res[0]['len']);
        }
    );
};
