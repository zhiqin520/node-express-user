var User = require('../user');

module.exports = function(req, res, next){
  if (req.remoteUser) {
    res.locals.user = req.remoteUser;
  }
  //从session中拿uid
  var uid = req.session.uid;
  if (!uid) return next();
  User.getById(uid, function(err, user){
    if (err) return next(err);
    //user中间件, 将user对象存储到req.user, 以便后面访问
    req.user = res.locals.user = user;
    next();
  });
};
