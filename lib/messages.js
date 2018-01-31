var express = require('express');
var res = express.response;

//在session中保存message array
res.message = function(msg, type){
  type = type || 'info';
  var sess = this.req.session;
  sess.messages = sess.messages || [];
  sess.messages.push({ type: type, string: msg });
};

res.error = function(msg){
  return this.message(msg, 'error');
};

//message中间件, 每次请求将req.session.messages组装到res.locals.messages, 并清除message
module.exports = function(req, res, next){
  res.locals.messages = req.session.messages || [];
  res.locals.removeMessages = function(){
    req.session.messages = [];
  };
  next();
};
