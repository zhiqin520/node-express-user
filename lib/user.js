var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var db = mysql.createConnection({
    host:     '127.0.0.1',
    user:     'root',
    password: '940327!',
    database: 'node_express_user'
});

module.exports = User;

function User(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

User.getById = function(id, fn){
    var query = "SELECT * FROM user " +
        "WHERE id=? ";
    db.query(
        query,
        [id],
        function(err, rows) {
            if (err) throw err;
            fn(null, new User(rows[0]))
        }
    );
};

User.getByName = function(name, fn){
    var query = "SELECT * FROM user " +
        "WHERE name=? ";
    db.query(
        query,
        [name],
        function(err, rows) {
            if (err) throw err;
            fn(null, rows[0])
        }
    );
};

//登录验证用户
User.authenticate = function(name, pass, fn){
    User.getByName(name, function(err, user){
        if (err) return fn(err);
        if (!user || !user.id) return fn();
        bcrypt.hash(pass, user.salt, function(err, hash){
            if (err) return fn(err);
            if (hash == user.pass) return fn(null, user);
            fn();
        });
    });
};

//注册表单提交
User.prototype.save = function(fn){
  var user = this;
    user.hashPassword(function () {
        db.query(
            "INSERT INTO user (name, pass, salt) " +
            " VALUES (?, ?, ?)",
            [user.name, user.pass, user.salt],
            function(err) {
                if (err) throw err;
                fn(err);
            }
        );
    })
};

User.prototype.hashPassword = function(fn){
  var user = this;
  bcrypt.genSalt(12, function(err, salt){
    if (err) return fn(err);
    user.salt = salt;
    bcrypt.hash(user.pass, salt, function(err, hash){
      if (err) return fn(err);
      user.pass = hash;
      fn();
    })
  });
};

//定义对象上的.toJSON, JSON.stringify会用这个返回JSON格式
User.prototype.toJSON = function(){
    return {
        id: this.id,
        name: this.name
    }
};
